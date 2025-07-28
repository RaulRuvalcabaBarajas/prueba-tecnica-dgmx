from aws_cdk import (
    Stack,
    CfnOutput,
    RemovalPolicy
)
from aws_cdk import aws_cognito as cognito
from constructs import Construct

class InfraStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Crear User Pool de Cognito para autenticación
        user_pool = cognito.UserPool(self, "UserPool",
            user_pool_name="GestorOrgsUserPool",
            self_sign_up_enabled=True,
            sign_in_aliases=cognito.SignInAliases(
                email=True, 
                username=True
            ),
            auto_verify=cognito.AutoVerify(
                email=True
            ),
            password_policy=cognito.PasswordPolicy(
                min_length=8,
                require_lowercase=True,
                require_uppercase=True,
                require_digits=True,
                require_symbols=True
            ),
            standard_attributes=cognito.StandardAttributes(
                email=cognito.StandardAttribute(required=True, mutable=True),
                given_name=cognito.StandardAttribute(required=True, mutable=True),
                family_name=cognito.StandardAttribute(required=True, mutable=True)
            ),
            removal_policy=RemovalPolicy.DESTROY  # Solo para desarrollo, cambia en producción
        )

        # Crear cliente de aplicación para el User Pool
        app_client = user_pool.add_client("AppClient",
            user_pool_client_name="gestor-orgs-client",
            auth_flows=cognito.AuthFlow(
                user_password=True,
                admin_user_password=True
            ),
            o_auth=cognito.OAuthSettings(
                flows=cognito.OAuthFlows(
                    implicit_code_grant=True
                ),
                callback_urls=["http://localhost:4200/callback", "http://localhost:4200/"],
                logout_urls=["http://localhost:4200/"]
            ),
            generate_secret=False  # No generar secreto para clientes web
        )

        # Crear Identity Pool para permitir acceso a recursos AWS
        identity_pool = cognito.CfnIdentityPool(self, "IdentityPool",
            identity_pool_name="GestorOrgsIdentityPool",
            allow_unauthenticated_identities=False,
            cognito_identity_providers=[{
                "clientId": app_client.user_pool_client_id,
                "providerName": user_pool.user_pool_provider_name
            }]
        )

        # Guardar referencia a los recursos para output
        self.user_pool_id = user_pool.user_pool_id
        self.user_pool_client_id = app_client.user_pool_client_id
        self.identity_pool_id = identity_pool.ref

        # Outputs para CloudFormation (mostrar en consola y facilitar exportación)
        CfnOutput(self, "UserPoolId", value=self.user_pool_id)
        CfnOutput(self, "UserPoolClientId", value=self.user_pool_client_id)
        CfnOutput(self, "IdentityPoolId", value=self.identity_pool_id)
        CfnOutput(self, "Region", value=self.region)

        # --- FASE 2: Tablas DynamoDB ---
        from aws_cdk import (
            aws_dynamodb as ddb,
            aws_iam as iam,
            aws_lambda as _lambda,
            aws_apigateway as apigw,
            Duration
        )

        # Tabla de organizaciones
        orgs_table = ddb.Table(self, "OrgsTable",
            partition_key=ddb.Attribute(name="id", type=ddb.AttributeType.STRING),
            billing_mode=ddb.BillingMode.PAY_PER_REQUEST
        )

        # Tabla de miembros
        members_table = ddb.Table(self, "MembersTable",
            partition_key=ddb.Attribute(name="organizationId", type=ddb.AttributeType.STRING),
            sort_key=ddb.Attribute(name="id", type=ddb.AttributeType.STRING),
            billing_mode=ddb.BillingMode.PAY_PER_REQUEST
        )
        members_table.add_global_secondary_index(
            index_name="UserIndex",
            partition_key=ddb.Attribute(name="userId", type=ddb.AttributeType.STRING)
        )

        # Tabla de invitaciones
        invitations_table = ddb.Table(self, "InvitationsTable",
            partition_key=ddb.Attribute(name="token", type=ddb.AttributeType.STRING),
            billing_mode=ddb.BillingMode.PAY_PER_REQUEST
        )

        # --- Lambdas y permisos ---
        lambda_props = dict(
            runtime=_lambda.Runtime.PYTHON_3_9,
            code=_lambda.Code.from_asset("../backend"),
            timeout=Duration.seconds(10)
        )

        # Organización
        create_org_fn = _lambda.Function(self, "CreateOrgFunction",
            handler="orgs.handler.create_org", **lambda_props
        )
        orgs_table.grant_read_write_data(create_org_fn)

        list_orgs_fn = _lambda.Function(self, "ListOrgsFunction",
            handler="orgs.handler.list_orgs", **lambda_props
        )
        orgs_table.grant_read_data(list_orgs_fn)

        get_org_fn = _lambda.Function(self, "GetOrgFunction",
            handler="orgs.handler.get_org", **lambda_props
        )
        orgs_table.grant_read_data(get_org_fn)

        update_org_fn = _lambda.Function(self, "UpdateOrgFunction",
            handler="orgs.handler.update_org", **lambda_props
        )
        orgs_table.grant_read_write_data(update_org_fn)

        delete_org_fn = _lambda.Function(self, "DeleteOrgFunction",
            handler="orgs.handler.delete_org", **lambda_props
        )
        orgs_table.grant_read_write_data(delete_org_fn)

        # Miembros
        list_members_fn = _lambda.Function(self, "ListMembersFunction",
            handler="members.handler.list_members", **lambda_props
        )
        members_table.grant_read_data(list_members_fn)

        add_member_fn = _lambda.Function(self, "AddMemberFunction",
            handler="members.handler.add_member", **lambda_props
        )
        members_table.grant_read_write_data(add_member_fn)
        invitations_table.grant_read_write_data(add_member_fn)

        update_member_fn = _lambda.Function(self, "UpdateMemberFunction",
            handler="members.handler.update_member_role", **lambda_props
        )
        members_table.grant_read_write_data(update_member_fn)

        remove_member_fn = _lambda.Function(self, "RemoveMemberFunction",
            handler="members.handler.remove_member", **lambda_props
        )
        members_table.grant_read_write_data(remove_member_fn)

        # Invitaciones
        get_invitation_fn = _lambda.Function(self, "GetInvitationFunction",
            handler="invitations.handler.get_invitation", **lambda_props
        )
        invitations_table.grant_read_data(get_invitation_fn)

        accept_invitation_fn = _lambda.Function(self, "AcceptInvitationFunction",
            handler="invitations.handler.accept_invitation", **lambda_props
        )
        invitations_table.grant_read_write_data(accept_invitation_fn)
        members_table.grant_read_write_data(accept_invitation_fn)

        # --- API Gateway ---
        api = apigw.RestApi(self, "API", rest_api_name="GestorOrgsAPI", default_cors_preflight_options={
            "allow_origins": apigw.Cors.ALL_ORIGINS,
            "allow_methods": apigw.Cors.ALL_METHODS
        })

        orgs = api.root.add_resource("orgs")
        orgs.add_method("GET", apigw.LambdaIntegration(list_orgs_fn))
        orgs.add_method("POST", apigw.LambdaIntegration(create_org_fn))
        org = orgs.add_resource("{id}")
        org.add_method("GET", apigw.LambdaIntegration(get_org_fn))
        org.add_method("PUT", apigw.LambdaIntegration(update_org_fn))
        org.add_method("DELETE", apigw.LambdaIntegration(delete_org_fn))

        members = org.add_resource("members")
        members.add_method("GET", apigw.LambdaIntegration(list_members_fn))
        members.add_method("POST", apigw.LambdaIntegration(add_member_fn))
        member = members.add_resource("{memberId}")
        member.add_method("PATCH", apigw.LambdaIntegration(update_member_fn))
        member.add_method("DELETE", apigw.LambdaIntegration(remove_member_fn))

        invitations = api.root.add_resource("invitations")
        invitations.add_method("GET", apigw.LambdaIntegration(get_invitation_fn))
        invitations.add_method("POST", apigw.LambdaIntegration(accept_invitation_fn))
