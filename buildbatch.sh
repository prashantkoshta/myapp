#!/bin/bash
echo "Here is an example of a shell script test"
echo "1a. File listing"
cd /tmp
mkdir devtool
cd devtool
apt-get install wine
wget http://dl.google.com/android/android-sdk_r24.4.1-linux.tgz
tar -xvzf android-sdk_r24.4.1-linux.tgz
export PATH=$PATH:/tmp/devtool/android-sdk-linux/tools
export PATH=$PATH:/tmp/devtool/android-sdk-linux/platforms
export ANDROID_HOME =/tmp/devtool/android-sdk-linux
android update sdk --no-ui
cd /tmp
mkdir dev_tmp
cd dev_tmp
git clone https://github.com/codepath/android_hello_world
cd /tmp/dev_tmp
wine gradlew.bat
bash gradlew
echo #######SUCCESSFULL-COMPLETED-BUILD-TOKEN######
