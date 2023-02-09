# GAP Lambda - Scheduled Publishing

1. A scheduled job sends messages to a queue that contains the following attributes:
   - A grantAdvertId
   - Whether to publish or unpublish the advert
2. That queue invokes this lambda
3. Lambda sends a request to a backend endpoint for publishing/unpublishing
   - A load balancer distributes this request to the optimal backend node
4. Lambda waits around 100ms (configurable)
   - This ensures we stay under contentfuls limit of 10 requests per second

## Continuous Deployment
- This repo builds & deploys to an S3 bucket on pushes to main
- Our GAP-Infra aws pipeline pulls from this bucket when instantiating the lambda's for the different envs
