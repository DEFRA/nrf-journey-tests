#!/bin/bash

# Create LocalStack resources needed by the NRF stack

# SNS topic for quote estimate requests (used by nrf-backend)
awslocal sns create-topic \
  --name nrf_quote_estimate_request \
  --region eu-west-2
