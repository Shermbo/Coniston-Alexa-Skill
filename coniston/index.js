/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * Camp Coniston Amazon Alexa Skill
 * Created: 11-Mar-2018
 * V1 Published: 05-Jan-2019
 * Modified: Oct-2019 - based on Camp's Feedback
 * Modified: 06-Nov-2019 - updated Runtime to Node.js 10 from Node.js 8
 * Modified: 07-Aug-2020 - COVID / Camp Closure modifications
 * Modified: 07-Sep-2020 - still COVID but resetting for Summer of 2020
 * Modified: 27-Jun-2021 - updating based on Summer 2021 check-in changes
 * Modified: 11-Apr-2022 - update for Summer 2022 (late!)
 * Modified: 08-Sep-2022 - update for Summer 2023 (early!)
 * Modified: 20-Jan-2024 - update for Summer 2024 (on time?)
 * Modified: 20-Jan-2024 - updated for Node.js version 20.x (??)
 * Modified: 22-Oct-2024 - initial updates for Summer 2025
 * Modified: 7-Apr-2025 - adding to GitHub and automating deployments to Lambda
 *  
 * based on nodejs skill development kit
 * This skill supports multiple lauguages. (en-US, en-GB, de-DE). ???
 * Find this skill's page on https://developer.amazon.com/alexa/console/ask
 * or https://developer.amazon.com/alexa/console/ask/build/custom/amzn1.ask.skill.0942e857-fefd-4b8e-935a-fbfd20e1b244/development/en_US/dashboard
**/

'use strict';
const Alexa = require('alexa-sdk');

//=========================================================================================================================================
//=========================================================================================================================================

//Skill app ID
const APP_ID = 'amzn1.ask.skill.0942e857-fefd-4b8e-935a-fbfd20e1b244';

const SKILL_NAME = 'Camp Coniston';
const GET_FACT_MESSAGE = "Here is a Coniston fact: ";
const HELP_MESSAGE = 'You can ask when a camping session begins.';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';
const PLAYBACK_CANCELED = "Playback Canceled";
const PLAYBACK_FINISHED = "Playback is Finished";
const PLAYBACK_PAUSED = "Playback is paused";

//=========================================================================================================================================
//Arrays
//=========================================================================================================================================
const coniston_facts = [
/* 
    'Camp Coniston covers over fifteen hundred acres of land surrounding Lake Coniston.',
    'The Pavilion was built on the site of what used to be a volleyball court.',
    'There used to be a girls lean to overnight spot, located on the trail between Bigelow and Trigger.',
    'The Girls waterfront used to have a three meter high dive like at Boys waterfront, but it was removed because the lake became too shallow underneath it.',
    'Camp Coniston welcomes campers and staff from 16 countries and 28 states!',
    'The deepest part of Lake Coniston is in a surprising location! The Bog!',
    'Loon families nest on Lake Coniston every summer. We love welcoming the baby loons!',
    'Our camp Director, John Tilley, has been leading Camp Coniston for 23 years!',
    'Camp Coniston has a high retention rate, 90% of campers return each year!',
    'The camp\'s archery range used to be between the tennis courts and bog, but is now located next to the A field.',
    'The current dining hall was built on the site of a cabin named Tamarak, which used to house the youngest girl campers.'
*/
    'This is a test - hello Sherman'
    ];

const audio_clips = [
/* */
    'https://s3.amazonaws.com/media.coniston.org/alexa/bell1.mp3',
    'https://s3.amazonaws.com/media.coniston.org/alexa/bell2.mp3',
    'https://s3.amazonaws.com/media.coniston.org/alexa/bogfrogs.mp3',
    'https://s3.amazonaws.com/media.coniston.org/alexa/frogsowl.mp3',
    'https://s3.amazonaws.com/media.coniston.org/alexa/loonsfrogs.mp3',
//    'https://s3.amazonaws.com/media.coniston.org/alexa/MeatballsSide1.mp3',
    'https://s3.amazonaws.com/media.coniston.org/alexa/campbackground.mp3',
    'https://s3.amazonaws.com/media.coniston.org/alexa/singingtaps.mp3'
];

//=========================================================================================================================================
/*

2025

SESSION 1: June 22 – July 5
SESSION 2: July 6 – July 19
SESSION 3: July 20 – August 2
SESSION 4: August 3 – August 16

SESSION 5: August 18 – August 23

Winning Spirit: August 29 
*/
//=========================================================================================================================================

const handlers = {
    'LaunchRequest': function () {
        this.emit('DefaultIntent');
    },
    'DefaultIntent': function () {
        this.response.cardRenderer(SKILL_NAME, "Ask Camp Coniston when a session begins!");
        this.response.speak("What would you like to know? Just say ask Camp Coniston followed by your request.");
        this.emit(':responseReady');
    },
    'SessionIntent': function () {
        var gapdays;
        var start_date;
        var session_start;
        var start_time;
        var now_date = new Date();
        var now_time = now_date.getTime();
        var speak_str;
        var card_output;
        var intent = this.event.request.intent;
        var session_name_Slot = intent.slots.sessionnumber.value;

        switch (session_name_Slot) {
            //------------------------------------------------------------SUMMER CAMP SESSIONS--------------------------------------------------------//           
            case 'session 1' :
            case 'camp' :
                // calculate days until session begins
                session_start = new Date("June 22, 2025 12:00:00");
                start_date = "june twenty second";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = session_name_Slot + " starts in " + gapdays + " days on " + start_date;
                    card_output = "Session 1\n" + gapdays + " days\n6/22/2025";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time."
                if (gapdays == 1) {
                    speak_str = "Session one starts tomorrow! Don't be too early or too late!";
                    card_output = "Session 1\nStarts\nTomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "Session one starts today! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 1\nStarts\nToday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "Session one has already started.";
                    card_output = "Session 1\nHas Already\nStarted!";
                }
                break;
            case 'session 2' :
                // calculate days until session begins
                session_start = new Date("July 6, 2025 12:00:00");
                start_date = "july sixth";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = session_name_Slot + " starts in " + gapdays + " days on " + start_date;
                    card_output = "Session 2\n" + gapdays + " days\n7/6/2025";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time."
                if (gapdays == 1) {
                    speak_str = "Session two starts tomorrow! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 2\nStarts\nTomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "Session two starts today! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 2\nStarts\nToday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "Session two has already started.";
                    card_output = "Session 2\nHas Already\nStarted!";
                }
                break;
            case 'session 3' :
                // calculate days until session begins
                session_start = new Date("July 20, 2025 12:00:00");
                start_date = "july twentieth";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = session_name_Slot + " starts in " + gapdays + " days on " + start_date;
                    card_output = "Session 3\n" + gapdays + " days\n7/20/2025";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "Session three starts tomorrow! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 3\nStarts\nTomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "Session three starts today! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 3\nStarts\nToday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "Session three has already started, you know.";
                    card_output = "Session 3\nHas Already\nStarted!";
                }
                break;
            case 'session 4' :
                // calculate days until session begins
                session_start = new Date("August 3, 2025 12:00:00");
                start_date = "august third";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = session_name_Slot + " starts in " + gapdays + " days on " + start_date;
                    card_output = "Session 4\n" + gapdays + " days\n8/3/2025";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "Session four starts tomorrow! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 4\nStarts\nTomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "Session four starts today! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 4\nStarts\nToday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "Session four has already started.";
                    card_output = "Session 4\nHas Already\nStarted!";
                }
                break;
            case 'session 5' :
            case '1 week camp' :
            case '1 week session' :
                // calculate days until session begins
                session_start = new Date("August 18, 2025 11:00:00");
                start_date = "august eighteenth";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "Session five, our one week camping session, starts in " + gapdays + " days on " + start_date;
                    card_output = "Session 5\n" + gapdays + " days\n8/18/2025";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "Session five, our one week camping session, starts tomorrow! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 5\nStarts\nTomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "Session five, our one week camping session, starts today! Check-in times are specific to individual campers. Contact the camp office if you need a check-in time.";
                    card_output = "Session 5\nStarts\nToday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "Session five, our one week camping session, has already started.";
                    card_output = "Session 5\nHas Already\nStarted!";
                }
                break;
            //------------------------------------------------------------WINNING SPIRIT--------------------------------------------------------//                
            case 'camp winning spirit' :
            case 'winning spirit' :
                // calculate days until session begins
                session_start = new Date("August 29, 2025 09:00:00");
                start_date = "august twenty ninth";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "Camp Winning Spirit starts in " + gapdays + " days on " + start_date;
                    card_output = "Winning Spirit\n" + gapdays + " days\n8/29/2025";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "Camp Winning Spirit starts tomorrow!";
                    card_output = "Winning Spirit\nStarts Tomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "Camp Winning Spirit starts today!";
                    card_output = "Winning Spirit\nStarts Today!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "Camp Winning Spirit has already started.";
                    card_output = "Winning Spirit\nHas Already\nStarted!";
                }
                break;
            
            //=========================================================================================================================================
            //-------------------------------------------ADVENTURE CAMP TRIPS-----------------------------------------------------------------------------
            /*

            2024 6 DAY ADVENTURE CAMP FOR AGES 12-15

            Green Mtn. Explorer: June 30 – July 5
            Acadian Odyssey: July 7 – July 12
            Coastal Navigator: July 14 – July 19
            Quebec Quest: July 21 – July 26
            Maine Voyager: July 28 – Aug 2
            Northern N.E. Explorer: Aug 4 – Aug 9

            2024 10 DAY EXTENDED ADVENTURE CAMP FOR AGES 12-15

            Quebec Extended Adventure: July 21 – July 30
            */
            //=========================================================================================================================================

            
            case 'adventure camp' :
                // calculate days until session begins
                speak_str = "There are seven adventure camp trips this summer. Please try again and specify the name of the adventure camp trip.";
                card_output = "Which Trip?";                
                break;
            
            case 'green mountain explorer' :
                // calculate days until session begins
                session_start = new Date("June 30, 2024 12:00:00");
                start_date = "june thirtieth";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts in " + gapdays + " days on " + start_date;
                    card_output = "Trip starts in\n" + gapdays + " days\n6/30/2024";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts tomorrow! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts today! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntoday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", has already started.";
                    card_output = "Trip has\nstarted!";
                }
                break;

            case 'coastal navigator' :
                // calculate days until session begins
                session_start = new Date("July 14, 2024 12:00:00");
                start_date = "July fourteenth";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts in " + gapdays + " days on " + start_date;
                    card_output = "Trip starts in\n" + gapdays + " days\n7/14/2024";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts tomorrow! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts today! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntoday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", has already started.";
                    card_output = "Trip has\nstarted!";
                }
                break;

            case 'northern new England explorer' :
                // calculate days until session begins
                session_start = new Date("August 4, 2024 12:00:00");
                start_date = "August fourth";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts in " + gapdays + " days on " + start_date;
                    card_output = "Trip starts in\n" + gapdays + " days\n8/4/2024";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts tomorrow! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts today! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntoday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", has already started.";
                    card_output = "Trip has\nstarted!";
                }
                break;

            case 'Acadian odyssey' :
                // calculate days until session begins
                session_start = new Date("July 7, 2024 12:00:00");
                start_date = "July seventh";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts in " + gapdays + " days on " + start_date;
                    card_output = "Trip starts in\n" + gapdays + " days\n7/7/2024";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts tomorrow! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts today! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntoday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", has already started.";
                    card_output = "Trip has\nstarted!";
                }
                break;

            // NEW 10 DAY Adventure Trip

            case 'Quebec extended adventure' :
            case 'extended adventure':

                // calculate days until session begins
                session_start = new Date("July 21, 2024 12:00:00");
                start_date = "july twenty first";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts in " + gapdays + " days on " + start_date;
                    card_output = "Trip starts in\n" + gapdays + " days\n7/21/2024";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts tomorrow! Check-in starts at nine A M. Don't be too early or too late!";
                    card_output = "Trip starts\ntomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts today! Check-in starts at nine A M. Don't be too early or too late!";
                    card_output = "Trip starts\ntoday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", has already started.";
                    card_output = "Trip has\nstarted!";
                }
                break;
                
            case 'Quebec quest' :
                // calculate days until session begins
                session_start = new Date("July 21, 2024 12:00:00");
                start_date = "july twenty first";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts in " + gapdays + " days on " + start_date;
                    card_output = "Trip starts in\n" + gapdays + " days\n7/21/2024";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts tomorrow! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts today! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntoday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", has already started.";
                    card_output = "Trip has\nstarted!";
                }
                break;

            case 'main voyager' :
            case 'Maine voyager' :
                // calculate days until session begins
                session_start = new Date("July 28, 2024 12:00:00");
                start_date = "July twenty eighth";
                start_time = session_start.getTime();
                gapdays = Math.round((start_time - now_time) / (1000*60*60*24), -1);

                // default - 2 or more days until session
                if (gapdays > 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts in " + gapdays + " days on " + start_date;
                    card_output = "Trip starts in\n" + gapdays + " days\n7/28/2024";
                }
                // if gapdays = 0 speak "Session one starts tomorrow! Check-in starts at noon. Don't be too early or too late!"
                if (gapdays == 1) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts tomorrow! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntomorrow!";
                }
                // if gapdays = -1 speak "Session one starts today! Check-in starts at noon."
                if (gapdays == 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", starts today! Check-in starts at noon. Don't be too early or too late!";
                    card_output = "Trip starts\ntoday!";
                }
                // if gapdays < -1 speak "Session one has already started."
                if (gapdays < 0) {
                    speak_str = "The adventure camp trip, " + session_name_Slot + ", has already started.";
                    card_output = "Trip has\nstarted!";
                }
                break;

            default :
                //speak_str = covid_speak;
                //card_output = covid_card;
                speak_str = "Camp Coniston starts on June twenty third, two thousand and twenty four. If you want to know when a specific camping session or adventure camp trip begins, please ask when that starts by name.";
                card_output = "2024 Camping Sessions\nbegin\nJune 23rd, 2023!";
                break;            
        }

        this.response.cardRenderer(SKILL_NAME, card_output);
        this.response.speak(speak_str);
        this.emit(':responseReady');
    },
    'ConistonFactIntent': function () {
        const factArr = coniston_facts;
        const factIndex = Math.floor(Math.random() * factArr.length);
        //const factIndex = 5; // used for testing only
        const randomFact = factArr[factIndex];
        const speechOutput = GET_FACT_MESSAGE + randomFact;

        this.response.cardRenderer(SKILL_NAME, randomFact);
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'OvernightSpotsIntent': function() {
        this.response.cardRenderer(SKILL_NAME, "There are seven overnight spots!");
        this.response.speak('There are seven overnight spots. Clockwise from boys camp they are: boys lean-to, gazebo, boys cabin, flume, generals grove, loon point, and Trigger');
        this.emit(':responseReady');
    },
    'MailingAddressIntent': function() {
        this.response.cardRenderer(SKILL_NAME, "Name, Cabin #\nP.O. Box 185\nGrantham, NH  03753");
        this.response.speak('Mail can be sent to P O Box one eighty five, grantham, new hampshire, oh three seven five three. For packages via Fedex or u p s, use the address twenty four main camp road, grantham, new hampshire, oh three seven five three. Include the campers cabin number if you know it.');
        this.emit(':responseReady');
    },
    'CheckInIntent': function() {
        this.response.cardRenderer(SKILL_NAME, "Check-In\n2-week: Noon-2pm\n1-week: 11am");
        this.response.speak('Check in for two week camp sessions is from noon until two PM on the check in sunday. Check in for the one week camp session is monday, august twenty fourth, from eleven AM until noon.');
        this.emit(':responseReady');
    },
    'CheckOutIntent': function() {
        this.response.cardRenderer(SKILL_NAME, "Check-Out\n2-week: Sat 9-11am\n1-week: Sat 9-10am");
        this.response.speak('Check out for two week camp sessions is from nine AM until eleven AM on the check out saturday. Check out for the one week camp session is Saturday, august twenty ninth, from nine AM until eleven AM.');
        this.emit(':responseReady');
    },
    'PlaySoundAIntent': function() {
        this.response.cardRenderer(SKILL_NAME, "A sound from camp.");    
        const clipArr = audio_clips;
        const clipIndex = Math.floor(Math.random() * clipArr.length);
        const randomClip = clipArr[clipIndex];
        this.response.speak('A sound from camp.<break time="1s"/>');

        this.response.audioPlayerPlay('REPLACE_ALL',randomClip,'83472',null,0);
        this.emit(':responseReady');
    },
    'RingBellIntent': function() {
        this.response.cardRenderer(SKILL_NAME, "The bell is rung to signal activity changes and meals.");    
        this.response.audioPlayerPlay('REPLACE_ALL','https://s3.amazonaws.com/media.coniston.org/alexa/bell1.mp3','22372',null,0);
        this.emit(':responseReady');
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = HELP_MESSAGE;
        const reprompt = HELP_REPROMPT;

        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        this.emit('AMAZON.CancelIntent');
    },
    'AMAZON.NextIntent': function () {
        this.response.cardRenderer(SKILL_NAME, "Another sound from camp.");    
        this.response.speak('Another sound from camp.<break time="1s"/>');
        const clipArr = audio_clips;
        const clipIndex = Math.floor(Math.random() * clipArr.length);
        const randomClip = clipArr[clipIndex];

        this.response.audioPlayerPlay('REPLACE_ALL',randomClip,'83472',null,0);
        this.emit(':responseReady');
    },
    'AMAZON.PreviousIntent': function () {
        this.response.cardRenderer(SKILL_NAME, "Another sound from camp.");    
        this.response.speak('Another sound from camp.<break time="1s"/>');
        const clipArr = audio_clips;
        const clipIndex = Math.floor(Math.random() * clipArr.length);
        const randomClip = clipArr[clipIndex];

        this.response.audioPlayerPlay('REPLACE_ALL',randomClip,'83472',null,0);
        this.emit(':responseReady');
    },
    'AMAZON.RepeatIntent': function () {
        this.response.cardRenderer(SKILL_NAME, "Another sound from camp.");    
        this.response.speak('Another sound from camp.<break time="1s"/>');
        const clipArr = audio_clips;
        const clipIndex = Math.floor(Math.random() * clipArr.length);
        const randomClip = clipArr[clipIndex];

        this.response.audioPlayerPlay('REPLACE_ALL',randomClip,'83472',null,0);
        this.emit(':responseReady');
    },
    'AMAZON.StartOverIntent': function () {
        this.response.cardRenderer(SKILL_NAME, "Another sound from camp.");    
        this.response.speak('Another sound from camp.<break time="1s"/>');
        const clipArr = audio_clips;
        const clipIndex = Math.floor(Math.random() * clipArr.length);
        const randomClip = clipArr[clipIndex];

        this.response.audioPlayerPlay('REPLACE_ALL',randomClip,'83472',null,0);
        this.emit(':responseReady');
    },
    'AMAZON.PauseIntent': function () {
        this.emit('AMAZON.CancelIntent');
    },
    'AMAZON.ResumeIntent': function () {
        this.response.speak('Please ask Camp Coniston to play a sound again.');
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        this.response.audioPlayerStop();
        this.response.speak(PLAYBACK_CANCELED);
        this.emit(':responseReady');
    }

};

exports.handler = function (event, context, callback) {
    const alexa = Alexa.handler(event, context, callback);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
