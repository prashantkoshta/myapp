@REM cd <TEMP_DIR_PATH>
@REM rd source /S /Q
@REM mkdir source
@REM npm install

@REM { giturl: 'https://github.com/codepath/android_hello_world',
@REM  tempdirname: 'Test Me201512711820261',
@REM  batchfilename: 'gradlew.bat',
@REM  projectdirname: '/android_hello_world',
@REM  outputfilepath: '/android_hello_world.apk' }

set giturl=%~1
set tempdirname=%~2
set batchfilename=%~3
set projectdirname=%~4
set outputfile=%~5

echo %giturl%
echo %tempdirname%
echo %batchfilename%
echo %projectdirname%
echo %outputfilepath%

cd p:
p:
rd %tempdirname% /S /Q
mkdir %tempdirname%
cd %tempdirname%
git clone %giturl%
cd %projectdirname%
%batchfilename%
echo test3
echo SUCCESSFULLCOMPLETEDBUILDTOKEN