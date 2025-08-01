import json
import uuid
import boto3
import os
import logging

# Configurar logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.environ.get('ORGS_TABLE', 'OrgsTable'))

# Headers CORS para todas las respuestas
CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
}

def add_cors_headers(response):
    if 'headers' not in response:
        response['headers'] = {}
    response['headers'].update(CORS_HEADERS)
    return response

def create_org(event, context):
    try:
        logger.info(f"Evento recibido: {json.dumps(event)}")
        
        # Manejar preflight OPTIONS request
        if event['httpMethod'] == 'OPTIONS':
            return add_cors_headers({'statusCode': 200, 'body': ''})
        
        logger.info(f"Variables de entorno: ORGS_TABLE={os.environ.get('ORGS_TABLE')}")
        
        body = json.loads(event['body'])
        logger.info(f"Body parseado: {body}")
        
        org_id = str(uuid.uuid4())
        item = {
            'id': org_id,
            'name': body['name'],
            'description': body.get('description', ''),
            'ownerId': body['ownerId'],
            'createdAt': body.get('createdAt', context.aws_request_id)
        }
        
        logger.info(f"Insertando item: {item}")
        table.put_item(Item=item)
        logger.info("Item insertado exitosamente")
        
        return add_cors_headers({'statusCode': 201, 'body': json.dumps(item)})
    except Exception as e:
        logger.error(f"Error en create_org: {str(e)}")
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})

def list_orgs(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    try:
        resp = table.scan()
        return add_cors_headers({'statusCode': 200, 'body': json.dumps(resp.get('Items', []))})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})

def get_org(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    org_id = event['pathParameters']['id']
    try:
        resp = table.get_item(Key={'id': org_id})
        item = resp.get('Item')
        if item:
            return add_cors_headers({'statusCode': 200, 'body': json.dumps(item)})
        else:
            return add_cors_headers({'statusCode': 404, 'body': json.dumps({'error': 'Organization not found'})})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})

def update_org(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    org_id = event['pathParameters']['id']
    body = json.loads(event['body'])
    try:
        update_expr = "set #n = :n, description = :d"
        expr_attr_names = {'#n': 'name'}
        expr_attr_values = {':n': body['name'], ':d': body.get('description', '')}
        table.update_item(
            Key={'id': org_id},
            UpdateExpression=update_expr,
            ExpressionAttributeNames=expr_attr_names,
            ExpressionAttributeValues=expr_attr_values
        )
        return add_cors_headers({'statusCode': 200, 'body': json.dumps({'id': org_id, **body})})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})

def delete_org(event, context):
    if event['httpMethod'] == 'OPTIONS':
        return add_cors_headers({'statusCode': 200, 'body': ''})
        
    org_id = event['pathParameters']['id']
    try:
        table.delete_item(Key={'id': org_id})
        return add_cors_headers({'statusCode': 204, 'body': ''})
    except Exception as e:
        return add_cors_headers({'statusCode': 500, 'body': json.dumps({'error': str(e)})})
