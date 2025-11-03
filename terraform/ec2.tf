# Create Key Pair
resource "aws_key_pair" "deployer" {
  key_name   = "terra-automate-key"
  public_key = file("C:\\Users\\HP\\Desktop\\Python\\xMongoshop\\Travelmania-project\\terraform\\terra-key.pub")
}

# Create EC2 Instance
resource "aws_instance" "travelmania_ec2" {
    ami                         = var.ami_id
    instance_type               = var.instance_type
    key_name                    = aws_key_pair.deployer.key_name
    security_groups             = [aws_security_group.travelmania_sg.name]
    subnet_id                   = aws_subnet.travelmania_public_subnet.id
    associate_public_ip_address = true
    tags = {
        Name = "Travelmania-ec2-instance"
        app  = "Jenkins"
    }
    root_block_device {
      volume_size = 30
      volume_type = "gp3"
    }
}