#!/bin/sh
SDK=/Library/Developer/CommandLineTools/SDKs/MacOSX.sdk
set -ex
clang++ -Wall -Werror -Wno-nullability-completeness \
  -I$SDK/usr/include -I$SDK/usr/include/libxml2 \
  -L$SDK/usr/lib \
  -lcurl -lxml2 \
  -o dict dict.cc
stat -f%z dict
chmod +x dict
./dict
