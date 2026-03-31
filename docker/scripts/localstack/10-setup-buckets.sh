#!/bin/bash

# Create LocalStack resources needed by the NRF stack

# SNS topic for quote estimate requests (used by nrf-backend)
awslocal sns create-topic \
  --name nrf_quote_estimate_request \
  --region eu-west-2

# S3 buckets for file uploads (used by cdp-uploader)
awslocal s3 mb s3://cdp-uploader-quarantine --region eu-west-2
awslocal s3 mb s3://boundaries --region eu-west-2

# SQS queues required by cdp-uploader
awslocal sqs create-queue \
  --queue-name cdp-clamav-results \
  --region eu-west-2

awslocal sqs create-queue \
  --queue-name cdp-uploader-download-requests \
  --region eu-west-2

awslocal sqs create-queue \
  --queue-name cdp-uploader-scan-results-callback.fifo \
  --attributes FifoQueue=true \
  --region eu-west-2

# Mock ClamAV queue — used by cdp-uploader when MOCK_VIRUS_SCAN_ENABLED=true
awslocal sqs create-queue \
  --queue-name mock-clamav \
  --region eu-west-2

# S3 event notification: trigger mock-clamav queue when a file lands in quarantine
awslocal s3api put-bucket-notification-configuration \
  --bucket cdp-uploader-quarantine \
  --notification-configuration '{
    "QueueConfigurations": [
      {
        "QueueArn": "arn:aws:sqs:eu-west-2:000000000000:mock-clamav",
        "Events": ["s3:ObjectCreated:*"]
      }
    ]
  }' \
  --region eu-west-2
