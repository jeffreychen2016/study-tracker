## Why created this app?

This app is designed to help my girl-friend track her daily study time. She can clock in and clock out to log her time. Once clock out, the time she spent will be accumulated on top of previous time. She can then allocate time to each subject she studied each day. 

## Demo

You can check out this app by clicking:
https://study-tracker-8f1fc.firebaseio.com

## Installation

If you want to test it in your local workstation, please follow this instruction to get this app set up for your further development.

- Clone down this repo 
- npm install
- Under src dictory, open up constants.js.example and
fill in your firebase configuration info
```  
firebaseConfig: {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
  }
};
```
- Save the file and rename the file as constants.js

## Usage
In the login page, you can use following credentail to log in:

username: test@test.com <br>
password: qq123456
![Login Page](https://raw.githubusercontent.com/jeffreychen2016/study-tracker/master/src/imgs/login.png)

Once you log in, you will see a clock and a button you can clock in and clock out.

![Clock Page](https://raw.githubusercontent.com/jeffreychen2016/study-tracker/master/src/imgs/clockin.png)

After you clock in, you can start studying whatever you need to study. Once you finish studying and ready to write down summaries, you can then cick on the "study log" link in the navbar.

Once you are in the "study log" page, you will see all of the categories (courses) you created. You can add more categories, edit existing categories, or delete unwanted categories.

![Category Page](https://raw.githubusercontent.com/jeffreychen2016/study-tracker/master/src/imgs/addcategory.png)


Once you have a category created, you can then click on "Get In" button on the category card to check all of study logs you had for the category

![log Page](https://raw.githubusercontent.com/jeffreychen2016/study-tracker/master/src/imgs/logpage.png)

If you want to add new log, you can click the big "+". A modal will appear for you to type in summary that you want to save.

If you clock in, but did not clock out before trying to add new log, a red error will show up on the modal.

![addlog Page](https://raw.githubusercontent.com/jeffreychen2016/study-tracker/master/src/imgs/addlog.png)

Once you clock out, and then come back to add a new log. All of time you spent will be accumulated for you to allocate to each log.

![addlog Page](https://raw.githubusercontent.com/jeffreychen2016/study-tracker/master/src/imgs/addlog2.png)

## Authors
[Jeffrey Chen](https://github.com/jeffreychen2016)
