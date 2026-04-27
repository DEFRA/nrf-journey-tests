#!/bin/bash

# Create LocalStack resources needed by the NRF stack

# SNS topic for quote estimate requests (published by nrf-backend,
# consumed by nrf-impact-assessor via the SQS subscription below).
awslocal sns create-topic \
  --name nrf-quote-estimate-request \
  --region eu-west-2

# SQS queue that nrf-impact-assessor polls for assessment jobs.
awslocal sqs create-queue \
  --queue-name nrf-impact-assessment-jobs \
  --region eu-west-2

# Subscribe the assessor's queue to the quote-estimate SNS topic so messages
# published by nrf-backend are delivered to nrf-impact-assessor.
awslocal sns subscribe \
  --topic-arn arn:aws:sns:eu-west-2:000000000000:nrf-quote-estimate-request \
  --protocol sqs \
  --notification-endpoint arn:aws:sqs:eu-west-2:000000000000:nrf-impact-assessment-jobs \
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
