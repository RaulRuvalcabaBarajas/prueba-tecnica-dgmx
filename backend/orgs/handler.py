import json
import uuid
import boto3
import os

dynamo = boto3.resource('dynamodb')
table = dynamo.Table(os.environ.get('ORGS_TABLE', 'OrgsTable'))

def create_org(event, context):
    body = json.loads(event['body'])
    org_id = str(uuid.uuid4())
    item = {
        'id': org_id,
        'name': body['name'],
        'description': body.get('description', ''),
        'ownerId': body['ownerId'],
        'createdAt': body.get('createdAt', context.aws_request_id)
    }
    try:
        table.put_item(Item=item)
        return {'statusCode': 201, 'body': json.dumps(item)}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}

def list_orgs(event, context):
    try:
        resp = table.scan()
        return {'statusCode': 200, 'body': json.dumps(resp.get('Items', []))}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}

def get_org(event, context):
    org_id = event['pathParameters']['id']
    try:
        resp = table.get_item(Key={'id': org_id})
        item = resp.get('Item')
        if item:
            return {'statusCode': 200, 'body': json.dumps(item)}
        else:
            return {'statusCode': 404, 'body': 'Organization not found'}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}

def update_org(event, context):
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
        return {'statusCode': 200, 'body': json.dumps({'id': org_id, **body})}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}

def delete_org(event, context):
    org_id = event['pathParameters']['id']
    try:
        table.delete_item(Key={'id': org_id})
        return {'statusCode': 204, 'body': ''}
    except Exception as e:
        return {'statusCode': 500, 'body': str(e)}
