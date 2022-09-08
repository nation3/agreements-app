# include .env file and export its env vars
# (-include to ignore error if it does not exist)
-include .env

all: clean install build coverage


# Clean the repo
clean  :; 
	forge clean


# Install the Modules
install :; 
	forge install


# Builds
build  :; 
	forge build 

# Test
test  :; 
	forge test 

# Get coverage
coverage  :; 
	forge coverage 
