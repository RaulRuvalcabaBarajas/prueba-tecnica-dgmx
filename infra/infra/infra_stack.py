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
