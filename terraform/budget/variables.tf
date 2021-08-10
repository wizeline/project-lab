#overall budget alert config
variable "currency" {
  type        = string
  description = "Currency to be used for all costs"
  default     = "USD"
}

variable "overall_cost_budget_config" {
  type        = object({ limit : number, threshold : number })
  description = "configurations for the overall budget"
  default = {
    limit     = 200
    threshold = 100
  }
}

variable "services_cost_budget_config" {
  type        = list(object({ service_name : string, limit : number, threshold : number }))
  description = "configurations for budgets per service"
  default = [
    {
      service_name = "Amazon Route 53"
      limit        = 5
      threshold    = 1
    },
    {
      service_name = "Amazon Route 53"
      limit        = 5
      threshold    = 1
    },
    {
      service_name = "Amazon DynamoDB"
      limit        = 2.5
      threshold    = 1
    },
    {
      service_name = "Amazon Simple Storage Service"
      limit        = 5
      threshold    = 2
    },
    {
      service_name = "AWS Key Management Service"
      limit        = 1.5
      threshold    = 0.7
    },
    {
      service_name = "AWS Secrets Manager"
      limit        = 2
      threshold    = 0.6
    }
  ]
}

variable "subscriber_emails" {
  type        = list(string)
  description = "Subscriber emails to recieve budget alert"
  default     = ["team-projectlab-aaaabqg7i7esnhpwhxjhtgavgm@wizeline.slack.com"]
}