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
    key            = "distribution/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "tf-state-locks-projectlab"
  }
}

provider "aws" {
  region = "us-east-1"
}

locals {
  env_prefix = terraform.workspace == "production" ? "production" : lower(replace(replace(replace(terraform.workspace, "_", "-"), "/", "-"), " ", "-"))

  resource_tags = {
    ProjectName = "ProjectLab"
    Environment = terraform.workspace == "production" ? "production" : terraform.workspace
    Terraform   = "true"
  }
}

data "aws_acm_certificate" "certificate" {
  domain   = "labs.wizeline.com"
  types    = ["AMAZON_ISSUED"]
  statuses = ["ISSUED"]
}

resource "aws_cloudfront_distribution" "distribution_prisma_studio" {
  origin {
    origin_id   = local.env_prefix == "production" ? "production" : local.env_prefix
    domain_name = local.env_prefix == "production" ? "origin.labs.wizeline.com" : "${local.env_prefix}-origin.labs.wizeline.com"
    custom_origin_config {
      http_port              = 8080
      https_port             = 8080
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["SSLv3"]
    }
  }
  enabled = true
  aliases = [local.env_prefix == "production" ? "prisma-studio.labs.wizeline.com" : "prisma-studio-${local.env_prefix}.labs.wizeline.com"]
  tags    = local.resource_tags

  ordered_cache_behavior {
    path_pattern               = "*"
    target_origin_id           = local.env_prefix == "production" ? "production" : local.env_prefix
    allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods             = ["GET", "HEAD"]
    response_headers_policy_id = "bffd0ec8-c1f8-4e0c-9237-1ff503193152"

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["Host", "Content-Type", "Authorization"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.env_prefix == "production" ? "production" : local.env_prefix

    forwarded_values {
      query_string = false

      cookies {
        forward = "all"
      }

      headers = ["Host", "Content-Type", "Authorization"]
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.certificate.arn
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

resource "aws_cloudfront_distribution" "distribution" {
  origin {
    origin_id   = local.env_prefix == "production" ? "production" : local.env_prefix
    domain_name = local.env_prefix == "production" ? "origin.labs.wizeline.com" : "${local.env_prefix}-origin.labs.wizeline.com"
    custom_origin_config {
      http_port              = 80
      https_port             = 80
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["SSLv3"]
    }
  }
  enabled = true
  aliases = [local.env_prefix == "production" ? "labs.wizeline.com" : "${local.env_prefix}.labs.wizeline.com"]
  tags    = local.resource_tags

  ordered_cache_behavior {
    path_pattern               = "*"
    target_origin_id           = local.env_prefix == "production" ? "production" : local.env_prefix
    allowed_methods            = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods             = ["GET", "HEAD"]
    response_headers_policy_id = "bffd0ec8-c1f8-4e0c-9237-1ff503193152"

    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000
    compress               = true
    viewer_protocol_policy = "redirect-to-https"

    forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
      headers = ["Host", "Content-Type", "Authorization"]
    }
  }

  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.env_prefix == "production" ? "production" : local.env_prefix

    forwarded_values {
      query_string = false

      cookies {
        forward = "all"
      }

      headers = ["Host", "Content-Type", "Authorization"]
    }

    viewer_protocol_policy = "allow-all"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate {
    acm_certificate_arn = data.aws_acm_certificate.certificate.arn
    ssl_support_method  = "sni-only"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
}

data "aws_route53_zone" "route53_zone" {
  name         = "labs.wizeline.com"
  private_zone = false
}

resource "aws_route53_record" "origin_distribution_route53_record" {
  zone_id         = data.aws_route53_zone.route53_zone.zone_id
  name            = local.env_prefix == "production" ? "origin" : "${local.env_prefix}-origin"
  type            = "A"
  allow_overwrite = true
  ttl             = 1
  records         = [var.lightsail_instance_ip_address]
  depends_on      = [aws_cloudfront_distribution.distribution]
}

resource "aws_route53_record" "distribution_route53_record" {
  zone_id         = data.aws_route53_zone.route53_zone.zone_id
  name            = local.env_prefix == "production" ? "" : local.env_prefix
  type            = "A"
  allow_overwrite = true

  alias {
    name                   = aws_cloudfront_distribution.distribution.domain_name
    zone_id                = aws_cloudfront_distribution.distribution.hosted_zone_id
    evaluate_target_health = true
  }

  depends_on = [aws_cloudfront_distribution.distribution]
}

resource "aws_route53_record" "distribution_prisma_studio_route53_record" {
  zone_id         = data.aws_route53_zone.route53_zone.zone_id
  name            = local.env_prefix == "production" ? "prisma-studio" : "prisma-studio-${local.env_prefix}"
  type            = "A"
  allow_overwrite = true

  alias {
    name                   = aws_cloudfront_distribution.distribution_prisma_studio.domain_name
    zone_id                = aws_cloudfront_distribution.distribution_prisma_studio.hosted_zone_id
    evaluate_target_health = true
  }

  depends_on = [aws_cloudfront_distribution.distribution_prisma_studio]
}