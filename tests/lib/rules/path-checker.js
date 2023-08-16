/**
 * @fileoverview feature sliced relative path checker
 * @author anton
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require("../../../lib/rules/path-checker"),
  RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
});
ruleTester.run("path-checker", rule, {
  valid: [
        {
      filename: "/Users/anton/Desktop/Ulbi/pro/src/entities/Notification/ui/NotificationList/NotificationList.tsx",
      code: "import { useNotifications } from '../../api/notificationApi';",
      errors: [{ message: 'В рамках одного слайса все пути должны быть относительными' }],
    },
  ],

  invalid: [
    {
      filename: "/Users/anton/Desktop/Ulbi/pro/src/entities/Notification/ui/NotificationList/NotificationList.tsx",
      code: "import { useNotifications } from '@/entities/Notification/api/notificationApi'",
      errors: [{ message: "В рамках одного слайса все пути должны быть относительными"}],
      options: [
        {
          alias: '@'
        }
      ]
    },
    {
      filename: "/Users/anton/Desktop/Ulbi/pro/src/entities/Notification/ui/NotificationList/NotificationList.tsx",
      code: "import { useNotifications } from 'entities/Notification/api/notificationApi'",
      errors: [{ message: 'В рамках одного слайса все пути должны быть относительными' }],
    },
  ],
});
