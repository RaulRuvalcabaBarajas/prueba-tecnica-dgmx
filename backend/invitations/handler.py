import json
import boto3
import os
from datetime import datetime

dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.environ.get('INVITATIONS_TABLE', 'InvitationsTable'))
members_table = dynamo.Table(os.environ.get('MEMBERS_TABLE', 'MembersTable'))

# Obtener invitación por token
def get_invitation(event, context):
    token = event['queryStringParameters'].get('token') if event.get('queryStringParameters') else None
    if not token:
        return {'statusCode': 400, 'body': 'Token requerido'}
    try:
        resp = table.get_item(Key={'token': token})
        item = resp.get('Item')
        if item:
            return {'statusCode': 200, 'body': json.dumps(item)}
        else:
            return {'statusCode': 404, 'body': 'Invitation not found'}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}

# Aceptar invitación
def accept_invitation(event, context):
    body = json.loads(event['body'])
    token = body.get('token')
    user_id = body.get('userId')
    if not token or not user_id:
        return {'statusCode': 400, 'body': 'Token y userId requeridos'}
    try:
        # Actualizar invitación
        table.update_item(
            Key={'token': token},
            UpdateExpression="set #s = :a",
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':a': 'accepted'}
        )
        # Actualizar miembro a activo
        resp = table.get_item(Key={'token': token})
        invitation = resp.get('Item')
        if invitation:
            org_id = invitation['organizationId']
            # Buscar miembro por organizationId y email
            members = members_table.query(
                IndexName='UserIndex',
                KeyConditionExpression=boto3.dynamodb.conditions.Key('userId').eq(user_id)
            )
            for member in members.get('Items', []):
                if member['organizationId'] == org_id:
                    members_table.update_item(
                        Key={'organizationId': org_id, 'id': member['id']},
                        UpdateExpression="set status = :s",
                        ExpressionAttributeValues={':s': 'active'}
                    )
        return {'statusCode': 200, 'body': json.dumps({'token': token, 'status': 'accepted'})}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}
