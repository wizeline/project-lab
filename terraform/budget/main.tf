terraform {
  required_version = "0.13.5"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }
  backend "s3" {
    bucket         = "tf-state-projectlab"
    key            = "budget/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tf-state-locks-projectlab"
  }
}

provider "aws" {
  region = "us-east-1"
}

#cost budget alert for overall project
resource "aws_budgets_budget" "overall_cost_budget_alert" {
  name              = "Overall Cost Project Budget"
  time_unit         = "MONTHLY"
  budget_type       = "COST"
  time_period_start = "2021-06-01_00:00"
  limit_amount      = var.overall_cost_budget_config.limit
  limit_unit        = var.currency

  cost_types {
    include_credit             = false
    include_discount           = false
    include_other_subscription = false
    include_recurring          = false
    include_refund             = false
    include_subscription       = true
    include_support            = false
    include_tax                = false
    include_upfront            = false
    use_blended                = false
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = var.overall_cost_budget_config.threshold
    threshold_type             = "ABSOLUTE_VALUE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.subscriber_emails
  }
}

#cost budget alert for each defined service
resource "aws_budgets_budget" "cost_budget_per_service_alert" {
  for_each = { for service in var.services_cost_budget_config : service.service_name => service }

  name              = "${each.key} Cost Budget"
  time_unit         = "MONTHLY"
  budget_type       = "COST"
  time_period_start = "2021-06-01_00:00"
  limit_amount      = each.value.limit
  limit_unit        = var.currency

  cost_types {
    include_credit             = false
    include_discount           = false
    include_other_subscription = false
    include_recurring          = false
    include_refund             = false
    include_subscription       = true
    include_support            = false
    include_tax                = false
    include_upfront            = false
    use_blended                = false
  }

  cost_filters = {
    Service = each.key
  }

  notification {
    comparison_operator        = "GREATER_THAN"
    threshold                  = each.value.threshold
    threshold_type             = "ABSOLUTE_VALUE"
    notification_type          = "ACTUAL"
    subscriber_email_addresses = var.subscriber_emails
  }
}