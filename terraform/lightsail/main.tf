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
    key            = "lightsail/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tf-state-locks-projectlab"
  }
}

provider "aws" {
  region = "us-east-1"
}

locals {
  env_prefix = terraform.workspace == "production"?"production":lower(replace(replace(replace(terraform.workspace, "_", "-"), "/", "-"), " ", "-"))

  resource_tags = {
    ProjectName = "ProjectLab"
    Environment = terraform.workspace == "production" ? "production" : terraform.workspace
    Terraform   = "true"
  }
}

data "aws_secretsmanager_secret" "env_secret" {
  name = terraform.workspace == "production" ? "env-production" : "env-development"
}

data "aws_secretsmanager_secret_version" "env_secret_version" {
  secret_id = data.aws_secretsmanager_secret.env_secret.id
}

resource "aws_lightsail_instance" "instance" {
  name              = "project-lab-${local.env_prefix}"
  availability_zone = "us-east-1a"
  blueprint_id      = "debian_10"
  bundle_id         = "medium_2_0"
  key_pair_name     = "ssh-key"
  tags              = local.resource_tags
}

resource "aws_lightsail_instance_public_ports" "public_ports" {
  instance_name = aws_lightsail_instance.instance.name

  port_info {
    protocol  = "tcp"
    from_port = 80
    to_port   = 80
  }

  port_info {
    protocol  = "tcp"
    from_port = 22
    to_port   = 22
  }

  port_info {
    protocol  = "tcp"
    from_port = 8080
    to_port   = 8080
  }
}
