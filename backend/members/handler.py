import json
import uuid
import boto3
from boto3.dynamodb.conditions import Key
import os
from datetime import datetime

dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.environ.get('MEMBERS_TABLE', 'MembersTable'))
inv_table = dynamo.Table(os.environ.get('INVITATIONS_TABLE', 'InvitationsTable'))

# Headers CORS para todas las respuestas
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS'
}

def add_cors_headers(response):
    if 'headers' not in response:
        response['headers'] = {}
    response['headers'].update(CORS_HEADERS)
    return response

# Listar miembros de una organización
def list_members(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    org_id = event['pathParameters']['id']
    try:
        resp = table.query(
            KeyConditionExpression=Key('organizationId').eq(org_id)
        )
        return add_cors_headers({'statusCode': 200, 'body': json.dumps(resp.get('Items', []))})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})

# Añadir miembro (envía invitación)
def add_member(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    org_id = event['pathParameters']['id']  # Obtener org_id de la URL
    body = json.loads(event['body'])
    member_id = str(uuid.uuid4())
    token = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    
    member = {
        'id': member_id,
        'organizationId': org_id,  # Usar el org_id de la URL
        'userId': body.get('userId', ''),
        'role': body.get('role', 'member'),
        'email': body['email'],  # Agregar email al miembro
        'invitedAt': now,
        'status': 'pending'
    }
    invitation = {
        'token': token,
        'organizationId': org_id,
        'email': body['email'],
        'expiresAt': body.get('expiresAt', ''),
        'status': 'pending'
    }
    try:
        table.put_item(Item=member)
        inv_table.put_item(Item=invitation)
        return add_cors_headers({'statusCode': 201, 'body': json.dumps({'member': member, 'invitation': invitation})})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})

# Actualizar rol de miembro
def update_member_role(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    org_id = event['pathParameters']['id']
    member_id = event['pathParameters']['memberId']
    body = json.loads(event['body'])
    try:
        table.update_item(
            Key={'organizationId': org_id, 'id': member_id},
            UpdateExpression="set role = :r",
            ExpressionAttributeValues={':r': body['role']}
        )
        return add_cors_headers({'statusCode': 200, 'body': json.dumps({'id': member_id, 'role': body['role']})})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})

# Eliminar miembro
def remove_member(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    org_id = event['pathParameters']['id']
    member_id = event['pathParameters']['memberId']
    try:
        table.delete_item(Key={'organizationId': org_id, 'id': member_id})
        return add_cors_headers({'statusCode': 204, 'body': ''})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})
