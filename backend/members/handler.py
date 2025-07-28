import json
import uuid
import boto3
import os
from datetime import datetime

dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.environ.get('MEMBERS_TABLE', 'MembersTable'))
inv_table = dynamo.Table(os.environ.get('INVITATIONS_TABLE', 'InvitationsTable'))

# Listar miembros de una organización

def list_members(event, context):
    org_id = event['pathParameters']['id']
    try:
        resp = table.query(
            KeyConditionExpression=boto3.dynamodb.conditions.Key('organizationId').eq(org_id)
        )
        return {'statusCode': 200, 'body': json.dumps(resp.get('Items', []))}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}

# Añadir miembro (envía invitación)
def add_member(event, context):
    body = json.loads(event['body'])
    member_id = str(uuid.uuid4())
    token = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    member = {
        'id': member_id,
        'organizationId': body['organizationId'],
        'userId': body.get('userId', ''),
        'role': body.get('role', 'Member'),
        'invitedAt': now,
        'status': 'pending'
    }
    invitation = {
        'token': token,
        'organizationId': body['organizationId'],
        'email': body['email'],
        'expiresAt': body.get('expiresAt', ''),
        'status': 'pending'
    }
    try:
        table.put_item(Item=member)
        inv_table.put_item(Item=invitation)
        return {'statusCode': 201, 'body': json.dumps({'member': member, 'invitation': invitation})}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}

# Actualizar rol de miembro
def update_member_role(event, context):
    org_id = event['pathParameters']['id']
    member_id = event['pathParameters']['memberId']
    body = json.loads(event['body'])
    try:
        table.update_item(
            Key={'organizationId': org_id, 'id': member_id},
            UpdateExpression="set role = :r",
            ExpressionAttributeValues={':r': body['role']}
        )
        return {'statusCode': 200, 'body': json.dumps({'id': member_id, 'role': body['role']})}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}

# Eliminar miembro
def remove_member(event, context):
    org_id = event['pathParameters']['id']
    member_id = event['pathParameters']['memberId']
    try:
        table.delete_item(Key={'organizationId': org_id, 'id': member_id})
        return {'statusCode': 204, 'body': ''}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}
