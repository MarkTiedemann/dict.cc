#!/bin/sh
set -ex

if [ ! -d MacOSX10.14.sdk ]; then
	curl -OL https://github.com/phracker/MacOSX-SDKs/releases/download/10.14-beta4/MacOSX10.14.sdk.tar.xz
	tar -xJf MacOSX10.14.sdk.tar.xz
	rm MacOSX10.14.sdk.tar.xz
fi

if [ ! -d clang+llvm-8.0.0-x86_64-apple-darwin ]; then
	curl -OL http://releases.llvm.org/8.0.0/clang+llvm-8.0.0-x86_64-apple-darwin.tar.xz
	tar -xJf clang+llvm-8.0.0-x86_64-apple-darwin.tar.xz
	rm clang+llvm-8.0.0-x86_64-apple-darwin.tar.xz
fi

if [ ! -d curl-7.64.1 ]; then
	curl -OL https://github.com/curl/curl/releases/download/curl-7_64_1/curl-7.64.1.tar.xz
	tar -xJf curl-7.64.1.tar.xz
	rm curl-7.64.1.tar.xz
	make -C curl-7.64.1
fi

clang+llvm-8.0.0-x86_64-apple-darwin/bin/clang++ -std=c++11 \
	-Wall -Werror -Wno-nullability-completeness \
	-Iclang+llvm-8.0.0-x86_64-apple-darwin/include/c++/v1 \
	-IMacOSX10.14.sdk/usr/include \
	-Icurl-7.64.1/include -Lcurl-7.64.1/lib -lcurl \
	-o dict dict.cc

stat -f%z dict
chmod +x dict
./dict command line
