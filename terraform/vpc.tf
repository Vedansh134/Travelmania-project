# create a vpc
resource "aws_vpc" "travelmania_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "travelmania-vpc"
    app  = "Jenkins"
  }
}

# create a public subnet
resource "aws_subnet" "travelmania_public_subnet" {
  vpc_id     = aws_vpc.travelmania_vpc.id
  cidr_block = "10.0.1.0/24"
  tags = {
    Name = "travelmania-public-subnet"
    app  = "Jenkins"
  }
}

# create an internet gateway
resource "aws_internet_gateway" "travelmania_igw" {
  vpc_id = aws_vpc.travelmania_vpc.id
  tags = {
    Name = "travelmania-igw"
    app  = "Jenkins"
  }
}

# create a route table
resource "aws_route_table" "travelmania_route_table" {
  vpc_id = aws_vpc.travelmania_vpc.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.travelmania_igw.id
  }
}

# associate public subnet with route table
resource "aws_route_table_association" "travelmania_rta" {
  subnet_id      = aws_subnet.travelmania_public_subnet.id
  route_table_id = aws_route_table.travelmania_route_table.id
}
