#!/bin/bash
echo "Here is an example of a shell script test"
echo "1a. File listing"
cd /tmp
mkdir devtool
cd devtool
wget http://dl.google.com/android/android-sdk_r24.4.1-linux.tgz
tar -xvzf android-sdk_r24.4.1-linux.tgz
export PATH=$PATH:/app/devtool/android-sdk-linux/tools
export PATH=$PATH:/app/devtool/android-sdk-linux/platforms
export ANDROID_SDK_HOME =$PATH:/app/devtool/android-sdk-linux
cd /tmp
mkdir dev_tmp
cd dev_tmp
git clone https://github.com/codepath/android_hello_world