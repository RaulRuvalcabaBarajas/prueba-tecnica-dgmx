import json
import boto3
from boto3.dynamodb.conditions import Key
import os
from datetime import datetime

dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.environ.get('INVITATIONS_TABLE', 'InvitationsTable'))
members_table = dynamo.Table(os.environ.get('MEMBERS_TABLE', 'MembersTable'))

# Headers CORS para todas las respuestas
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS'
}

def add_cors_headers(response):
    if 'headers' not in response:
        response['headers'] = {}
    response['headers'].update(CORS_HEADERS)
    return response

# Obtener invitación por token
def get_invitation(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    token = event['queryStringParameters'].get('token') if event.get('queryStringParameters') else None
    if not token:
        return add_cors_headers({'statusCode': 400, 'body': json.dumps({'error': 'Token requerido'})})
    try:
        resp = table.get_item(Key={'token': token})
        item = resp.get('Item')
        if item:
            return add_cors_headers({'statusCode': 200, 'body': json.dumps(item)})
        else:
            return add_cors_headers({'statusCode': 404, 'body': json.dumps({'error': 'Invitation not found'})})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})

# Aceptar invitación
def accept_invitation(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    body = json.loads(event['body'])
    token = body.get('token')
    user_id = body.get('userId')
    if not token or not user_id:
        return add_cors_headers({'statusCode': 400, 'body': json.dumps({'error': 'Token y userId requeridos'})})
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
                KeyConditionExpression=Key('userId').eq(user_id)
            )
            for member in members.get('Items', []):
                if member['organizationId'] == org_id:
                    members_table.update_item(
                        Key={'organizationId': org_id, 'id': member['id']},
                        UpdateExpression="set status = :s",
                        ExpressionAttributeValues={':s': 'active'}
                    )
        return add_cors_headers({'statusCode': 200, 'body': json.dumps({'token': token, 'status': 'accepted'})})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})
