#!/bin/bash

# Create LocalStack resources needed by the NRF stack

# SNS topic for quote estimate requests (used by nrf-backend)
awslocal sns create-topic \
  --name nrf_quote_estimate_request \
  --region eu-west-2

# S3 bucket for boundary file uploads (used by cdp-uploader)
awslocal s3 mb s3://boundaries --region eu-west-2
