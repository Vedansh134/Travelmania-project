# define variable for aws region
variable "aws_region" {
    description   = "AWS region where resources will be provisioned"
    default       = "ap-south-1"
}

# define variable for AMI ID
variable "ami_id" {
    description  = "AMI ID for the EC2 instance"
    default      = ""
}

# define variable for instance type
variable "instance_type" {
    description  = "Instance type for the EC2 instance"
    default      = "t2.large"
}