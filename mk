#!/bin/sh
set -ex
clang++ -std=c++11 \
	-Wall -Werror -Wno-nullability-completeness \
	-I/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/include \
	-L/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk/usr/lib \
	-lcurl \
	-o dict dict.cc
stat -f%z dict
chmod +x dict
./dict command line
