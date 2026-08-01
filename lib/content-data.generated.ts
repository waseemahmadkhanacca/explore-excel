// GENERATED FILE — do not edit by hand.
// Produced by scripts/build-content.js from the .mdx files in content/.
// Run `npm run build` (which runs this automatically) after editing any
// .mdx file to regenerate this.

export const FORMULAS = [
  {
    "slug": "countifs",
    "data": {
      "slug": "countifs",
      "name": "COUNTIFS",
      "category": "Math",
      "summary": "Count rows meeting several conditions",
      "description": "COUNTIFS counts how many rows satisfy every condition you give it. It is the counting counterpart to SUMIFS, and the fastest way to check whether your criteria actually match anything before you rely on a total.",
      "versions": [
        "Excel 2007 and later"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/invoice-register.xlsx",
      "related": [
        "SUMIFS",
        "COUNTIF",
        "IF",
        "SUMPRODUCT"
      ],
      "syntax": "=COUNTIFS(criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
      "arguments": [
        {
          "name": "criteria_range1",
          "required": true,
          "description": "The range to test."
        },
        {
          "name": "criteria1",
          "required": true,
          "description": "What to test for. A value, a cell reference, or a comparison in quotes such as \">100\"."
        },
        {
          "name": "criteria_range2, criteria2",
          "required": false,
          "description": "Further pairs. Every condition must be true for a row to count. All ranges must be the same size."
        }
      ],
      "demo": {
        "file": "Q3 regional sales.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Order",
          "Region",
          "Status",
          "Amount"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "rows": [
          [
            "#1041",
            "North",
            "Closed",
            12400
          ],
          [
            "#1042",
            "South",
            "Open",
            8100
          ],
          [
            "#1043",
            "North",
            "Open",
            9600
          ],
          [
            "#1044",
            "North",
            "Closed",
            15250
          ],
          [
            "#1045",
            "East",
            "Closed",
            7300
          ],
          [
            "#1046",
            "North",
            "Closed",
            4880
          ]
        ],
        "presets": [
          {
            "label": "Count by region",
            "formula": "=COUNTIFS(B2:B7, \"North\")"
          },
          {
            "label": "Two conditions",
            "formula": "=COUNTIFS(B2:B7, \"North\", C2:C7, \"Closed\")"
          },
          {
            "label": "Numeric comparison",
            "formula": "=COUNTIFS(D2:D7, \">10000\")"
          },
          {
            "label": "Between two values",
            "formula": "=COUNTIFS(D2:D7, \">5000\", D2:D7, \"<13000\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Ranges of different sizes",
          "body": "Every criteria range must have the same number of rows. B2:B7 with C2:C8 returns"
        },
        {
          "level": "warning",
          "title": "Counting blanks by accident",
          "body": "Criteria of \"\" counts genuinely empty cells, but cells containing a formula that returns \"\" are not empty and will not be counted. The two look identical on screen. Use COUNTBLANK if you want both."
        },
        {
          "level": "warning",
          "title": "Expecting OR logic",
          "body": "Conditions combine with AND, so more criteria always means a smaller count, never a larger one. For OR, add two COUNTIFS together."
        },
        {
          "level": "warning",
          "title": "Comparison against a cell needs joining",
          "body": "To count values above whatever is in F1, write \">\"&F1. Writing \">F1\" looks for the literal text F1 and counts nothing, silently."
        }
      ],
      "faq": [
        {
          "q": "What is the difference between COUNTIF and COUNTIFS?",
          "a": "COUNTIF takes one condition, COUNTIFS takes up to 127. Unlike SUMIF and SUMIFS, the argument order is the same, so switching between them is safe. Use COUNTIFS by default."
        },
        {
          "q": "How do I count values between two numbers?",
          "a": "Use the same range twice with two conditions. =COUNTIFS(D2:D7,\">5000\",D2:D7,\"<13000\") counts everything in between. Use >= and <= if the boundaries should be included."
        },
        {
          "q": "How do I count unique values?",
          "a": "COUNTIFS cannot do this. Use =SUMPRODUCT(1/COUNTIFS(range,range)) for a count of distinct entries, or UNIQUE in Excel 365. The SUMPRODUCT version fails if the range contains blanks."
        },
        {
          "q": "Why does my COUNTIFS return zero?",
          "a": "The criteria never match. This is useful information — run COUNTIFS before trusting a SUMIFS with the same criteria. A zero count explains a zero sum immediately."
        },
        {
          "q": "Can COUNTIFS count dates?",
          "a": "Yes. Compare against DATE for reliability — \">=\"&DATE(2026,1,1) — rather than typing a date as text, which depends on regional settings."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. A single condition\n\n<Formula>=COUNTIFS(B2:B7, \"North\")</Formula>\n\nCounts every row in the North region. Note there is no sum range — COUNTIFS only ever counts rows, so the first argument is already a criteria range.\n\n### 2. Narrowing with a second condition\n\n<Formula>=COUNTIFS(B2:B7, \"North\", C2:C7, \"Closed\")</Formula>\n\nBoth must be true. Every pair you add makes the count smaller, because the conditions combine with AND.\n\n### 3. Counting between two values\n\n<Formula>=COUNTIFS(D2:D7, \">5000\", D2:D7, \"<13000\")</Formula>\n\nThe same range appears twice, with a lower and an upper bound. This is the standard way to build a band, and it is how ageing buckets and tax brackets are counted.\n\n<Callout type=\"tip\" title=\"Use it as a diagnostic\">\nWhen a SUMIFS returns zero and you cannot see why, run COUNTIFS with identical criteria. If the count is zero, the criteria are wrong or the data is not what you think it is. If the count is right but the sum is zero, the sum range is the problem. This narrows the search in one step.\n</Callout>\n"
  },
  {
    "slug": "datedif",
    "data": {
      "slug": "datedif",
      "name": "DATEDIF",
      "category": "Date",
      "summary": "Difference between two dates",
      "description": "DATEDIF returns the gap between two dates in whole years, months or days. It is undocumented in modern Excel and missing from the function list, yet it still works and remains the simplest way to calculate an age or a length of service.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/invoice-register.xlsx",
      "related": [
        "NETWORKDAYS",
        "EOMONTH",
        "DATE",
        "IFS"
      ],
      "syntax": "=DATEDIF(start_date, end_date, unit)",
      "arguments": [
        {
          "name": "start_date",
          "required": true,
          "description": "The earlier date. Must not be later than end_date or you get"
        },
        {
          "name": "end_date",
          "required": true,
          "description": "The later date."
        },
        {
          "name": "unit",
          "required": true,
          "description": "In quotes. \"Y\" for whole years, \"M\" for whole months, \"D\" for days. Also \"YM\", \"YD\" and \"MD\" for the remainder parts."
        }
      ],
      "demo": {
        "file": "Employee records.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Employee",
          "Start date",
          "Review date",
          "Salary"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "dates": [
          1,
          2
        ],
        "rows": [
          [
            "A Khan",
            44634,
            46037,
            48000
          ],
          [
            "J Brown",
            45537,
            46037,
            41500
          ],
          [
            "M Chen",
            43794,
            46037,
            62000
          ],
          [
            "S Diaz",
            45677,
            46037,
            38000
          ],
          [
            "O Farid",
            42527,
            46037,
            71000
          ],
          [
            "N Petrov",
            45887,
            46037,
            35500
          ]
        ],
        "presets": [
          {
            "label": "Whole years of service",
            "formula": "=DATEDIF(B2, C2, \"Y\")"
          },
          {
            "label": "In months",
            "formula": "=DATEDIF(B2, C2, \"M\")"
          },
          {
            "label": "In days",
            "formula": "=DATEDIF(B7, C7, \"D\")"
          },
          {
            "label": "Under a year",
            "formula": "=DATEDIF(B5, C5, \"Y\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Start date later than end date",
          "body": "DATEDIF returns"
        },
        {
          "level": "error",
          "title": "The unit must be in quotes",
          "body": "Write \"Y\" not Y. Without quotes Excel looks for a defined name called Y and returns"
        },
        {
          "level": "warning",
          "title": "Excel gives you no help writing it",
          "body": "DATEDIF does not appear in the function list and shows no argument tooltip as you type. It still calculates correctly. The absence is a documentation decision by Microsoft, not a sign it is deprecated in behaviour."
        },
        {
          "level": "warning",
          "title": "Months are whole months, not fractions",
          "body": "DATEDIF with \"M\" truncates. From 31 January to 28 February returns 0, because a full month has not elapsed. That is correct for length of service and wrong for anything needing a proportion."
        }
      ],
      "faq": [
        {
          "q": "Why is DATEDIF not in the function list?",
          "a": "Microsoft has never formally documented it, keeping it for compatibility with Lotus 1-2-3. It works in every version including Excel 365, but you have to type it from memory."
        },
        {
          "q": "How do I calculate an age?",
          "a": "=DATEDIF(birthdate, TODAY(), \"Y\") gives whole years, which is how age is normally counted. Dividing days by 365 is close but wrong across leap years."
        },
        {
          "q": "What do YM, YD and MD do?",
          "a": "They return the remainder after the whole units. \"YM\" gives the months left over after whole years — the piece you need for \"3 years and 7 months\"."
        },
        {
          "q": "Can I get a decimal number of years?",
          "a": "Not from DATEDIF, which always truncates. Use =(end-start)/365.25 for an approximation, accepting that it is approximate."
        },
        {
          "q": "Is there a modern replacement?",
          "a": "Not a single one. YEARFRAC gives a fraction of a year with several day-count conventions, which is better for financial calculations but different from what DATEDIF does."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Length of service in years\n\n<Formula>=DATEDIF(B2, C2, \"Y\")</Formula>\n\nWhole completed years only. Load the second preset and you will see someone eleven months into the job return 0 — correct for a service calculation, and surprising if you expected rounding.\n\n### 2. The same gap in months\n\n<Formula>=DATEDIF(B2, C2, \"M\")</Formula>\n\nAlso truncated. Useful for probation periods and for anything measured in months rather than years.\n\n### 3. In days\n\n<Formula>=DATEDIF(B7, C7, \"D\")</Formula>\n\nFor days you could simply subtract one date from the other. DATEDIF earns its place on years and months, where subtraction cannot help you.\n\n<Callout type=\"tip\" title=\"Years and months together\">\nThe readable form combines two calls: =DATEDIF(B2,C2,\"Y\")&\" years, \"&DATEDIF(B2,C2,\"YM\")&\" months\". The YM unit returns the leftover months after the whole years, which is exactly the second half of that sentence.\n</Callout>\n"
  },
  {
    "slug": "eomonth",
    "data": {
      "slug": "eomonth",
      "name": "EOMONTH",
      "category": "Date",
      "summary": "Find the end of a month",
      "description": "EOMONTH returns the last day of a month, either the one containing a date you give it or a number of months either side. It is the reliable way to build period ends without worrying about 30 days, 31 days or February.",
      "versions": [
        "Excel 2007 and later"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/cash-flow-forecast.xlsx",
      "related": [
        "DATEDIF",
        "NETWORKDAYS",
        "DATE",
        "IF"
      ],
      "syntax": "=EOMONTH(start_date, months)",
      "arguments": [
        {
          "name": "start_date",
          "required": true,
          "description": "Any date in the month you are counting from."
        },
        {
          "name": "months",
          "required": true,
          "description": "How many months forward or back. Zero gives the end of the current month, 1 the next, -1 the previous."
        }
      ],
      "demo": {
        "file": "Invoice dates.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Invoice",
          "Invoice date",
          "Terms (days)",
          "Amount"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "dates": [
          1
        ],
        "rows": [
          [
            "INV-201",
            46037,
            30,
            4850
          ],
          [
            "INV-202",
            46050,
            45,
            12300
          ],
          [
            "INV-203",
            46067,
            30,
            2975
          ],
          [
            "INV-204",
            46083,
            60,
            18400
          ],
          [
            "INV-205",
            46100,
            30,
            6220
          ],
          [
            "INV-206",
            46119,
            14,
            3140
          ]
        ],
        "presets": [
          {
            "label": "End of this month",
            "formula": "=EOMONTH(B2, 0)"
          },
          {
            "label": "End of next month",
            "formula": "=EOMONTH(B2, 1)"
          },
          {
            "label": "End of last month",
            "formula": "=EOMONTH(B2, -1)"
          },
          {
            "label": "Quarter end",
            "formula": "=EOMONTH(B2, 2)"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "The result shows as a number",
          "body": "EOMONTH returns a date serial, so an unformatted cell displays something like 46053. The formula is correct; the cell needs a date format. This confuses people more than any other aspect of the function."
        },
        {
          "level": "warning",
          "title": "Confusing EOMONTH with EDATE",
          "body": "EDATE keeps the same day of the month. EOMONTH always lands on the last day. For a payment due on the 15th, EDATE is right. For a period end, EOMONTH is right."
        },
        {
          "level": "warning",
          "title": "Assuming month end means payment due",
          "body": "EOMONTH plus a number of days gives an end-of-month-plus-terms date, but many organisations pay on a fixed day rather than a rolling one. Check the actual terms before building the logic."
        },
        {
          "level": "warning",
          "title": "Passing text instead of a date",
          "body": "A date written as the text 2026-01-15 may work or may give"
        }
      ],
      "faq": [
        {
          "q": "How do I get the first day of a month?",
          "a": "Take the end of the previous month and add one — =EOMONTH(A2,-1)+1. There is no FIRSTOFMONTH function, and this idiom is the standard workaround."
        },
        {
          "q": "Does EOMONTH handle leap years?",
          "a": "Yes. EOMONTH on any February date in 2028 returns the 29th. Doing this arithmetic by hand is exactly where errors creep in."
        },
        {
          "q": "How do I find a quarter end?",
          "a": "If your quarters follow the calendar, EOMONTH with 2, 5, 8 or 11 gets you there from a January date. For an arbitrary date, combining MONTH and ROUNDUP is more robust."
        },
        {
          "q": "Why does my result show as a number?",
          "a": "Date serials are how Excel stores dates internally. Format the cell as a date and it will display correctly. Nothing is wrong with the formula."
        },
        {
          "q": "Can I use a negative number of months?",
          "a": "Yes. -1 gives the previous month end, -12 the same month a year earlier. This is how prior-period comparatives are built."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. The end of the current month\n\n<Formula>=EOMONTH(B2, 0)</Formula>\n\nZero means the month containing the date. Whatever the invoice date, this returns the last day of that month — no need to know how many days it has.\n\n### 2. Moving forward and back\n\n<Formula>=EOMONTH(B2, 1)</Formula>\n\nOne gives next month's end, minus one gives last month's. This is how rolling period ends are generated for a forecast, and it handles year boundaries without any extra logic.\n\n### 3. Quarter ends\n\n<Formula>=EOMONTH(B2, 2)</Formula>\n\nFrom a January date, two months on lands on 31 March. For calendar quarters this is the simplest approach available.\n\n<Callout type=\"tip\" title=\"First of the month\">\nThere is no FIRSTOFMONTH function. The idiom everyone uses is =EOMONTH(A2,-1)+1 — the end of last month, plus a day. It looks odd the first time and then becomes second nature.\n</Callout>\n"
  },
  {
    "slug": "filter",
    "data": {
      "slug": "filter",
      "name": "FILTER",
      "category": "Dynamic array",
      "summary": "Return rows that meet a condition",
      "description": "FILTER returns every row matching a condition, spilling the results into the cells below. It replaces the advanced filter, most helper columns, and a great deal of copying and pasting.",
      "versions": [
        "Excel 365",
        "Excel 2021"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 6,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/kpi-dashboard.xlsx",
      "related": [
        "UNIQUE",
        "SORT",
        "COUNTIFS",
        "IFERROR"
      ],
      "syntax": "=FILTER(array, include, [if_empty])",
      "arguments": [
        {
          "name": "array",
          "required": true,
          "description": "The range to return rows from."
        },
        {
          "name": "include",
          "required": true,
          "description": "A condition producing TRUE or FALSE for each row, such as B2:B7=\"North\". Must be the same height as the array."
        },
        {
          "name": "if_empty",
          "required": false,
          "description": "What to return when nothing matches. Without it you get"
        }
      ],
      "demo": {
        "file": "Q3 regional sales.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Order",
          "Region",
          "Status",
          "Amount"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "rows": [
          [
            "#1041",
            "North",
            "Closed",
            12400
          ],
          [
            "#1042",
            "South",
            "Open",
            8100
          ],
          [
            "#1043",
            "North",
            "Open",
            9600
          ],
          [
            "#1044",
            "North",
            "Closed",
            15250
          ],
          [
            "#1045",
            "East",
            "Closed",
            7300
          ],
          [
            "#1046",
            "North",
            "Closed",
            4880
          ]
        ],
        "presets": [
          {
            "label": "Count what matches",
            "formula": "=COUNTIFS(B2:B7, \"North\")"
          },
          {
            "label": "Total the matches",
            "formula": "=SUMIFS(D2:D7, B2:B7, \"North\")"
          },
          {
            "label": "Two conditions",
            "formula": "=SUMIFS(D2:D7, B2:B7, \"North\", C2:C7, \"Closed\")"
          },
          {
            "label": "Largest match",
            "formula": "=MAXIFS(D2:D7, B2:B7, \"North\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Not available before Excel 2021",
          "body": "FILTER returns"
        },
        {
          "level": "error",
          "title": "The spill range is blocked",
          "body": "FILTER needs empty cells below and to the right to place its results. Anything in the way gives"
        },
        {
          "level": "warning",
          "title": "Nothing matches and no if_empty is set",
          "body": "With no third argument, a filter matching nothing returns"
        },
        {
          "level": "warning",
          "title": "The condition must be the same height as the array",
          "body": "Filtering A2:D7 with a condition built on B2:B8 gives"
        }
      ],
      "faq": [
        {
          "q": "Why does the demo above use SUMIFS rather than FILTER?",
          "a": "This interactive grid evaluates one formula into one cell. FILTER produces a spilled range of many cells, which the grid cannot show. The presets demonstrate the equivalent aggregate answers. Try FILTER itself in Excel."
        },
        {
          "q": "How do I filter on two conditions?",
          "a": "Multiply them. FILTER(A2:D7,(B2:B7=\"North\")*(C2:C7=\"Closed\")) is AND. Add them with a plus sign for OR. Multiplication converts TRUE and FALSE to 1 and 0."
        },
        {
          "q": "Can FILTER return only some columns?",
          "a": "Yes, if you point the array at just those columns. To pick non-adjacent columns you would wrap it in CHOOSECOLS, or run two FILTER formulas side by side."
        },
        {
          "q": "What is the difference between FILTER and an AutoFilter?",
          "a": "AutoFilter hides rows in place and is a manual action. FILTER produces a new live range that updates automatically as the source data changes. For anything feeding a report, FILTER is the better tool."
        },
        {
          "q": "What can I use in Excel 2019?",
          "a": "There is no clean equivalent. AutoFilter for manual work, a PivotTable for summaries, or SUMIFS and COUNTIFS when you only need aggregates rather than the rows themselves."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Filtering one column\n\n<Formula>=SUMIFS(D2:D7, B2:B7, \"North\")</Formula>\n\nThe interactive grid above shows aggregates because it evaluates a single formula into a single cell. In Excel, `=FILTER(A2:D7, B2:B7=\"North\")` would return the four matching rows in full, spilling down from wherever you type it.\n\n### 2. Two conditions\n\n<Formula>=SUMIFS(D2:D7, B2:B7, \"North\", C2:C7, \"Closed\")</Formula>\n\nThe FILTER equivalent multiplies the conditions: `=FILTER(A2:D7, (B2:B7=\"North\")*(C2:C7=\"Closed\"))`. Multiplication is AND because TRUE times TRUE is 1 and anything times FALSE is 0.\n\n<Callout type=\"tip\" title=\"AND and OR in dynamic arrays\">\nMultiply for AND, add for OR. `(B2:B7=\"North\")+(B2:B7=\"South\")` returns rows from either region. It looks strange the first time — you are doing arithmetic on logic — but it is the standard idiom and worth recognising.\n</Callout>\n\n### 3. Handling an empty result\n\nAlways give FILTER a third argument:\n\n`=FILTER(A2:D7, B2:B7=\"West\", \"No orders\")`\n\nWithout it, a filter that matches nothing returns `#CALC!`, which looks like a mistake rather than a legitimate answer of \"none\".\n"
  },
  {
    "slug": "if",
    "data": {
      "slug": "if",
      "name": "IF",
      "category": "Logical",
      "summary": "Return one value or another",
      "description": "IF tests a condition and returns one thing when it is true and another when it is false. It is the foundation of every decision a spreadsheet makes, and the function most likely to be nested until nobody can read it.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 6,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/invoice-register.xlsx",
      "related": [
        "IFS",
        "IFERROR",
        "AND",
        "COUNTIFS"
      ],
      "syntax": "=IF(logical_test, value_if_true, [value_if_false])",
      "arguments": [
        {
          "name": "logical_test",
          "required": true,
          "description": "Any expression that evaluates to TRUE or FALSE, such as A2>100 or B2=\"North\"."
        },
        {
          "name": "value_if_true",
          "required": true,
          "description": "What to return when the test passes. Can be a number, text in quotes, a cell reference, or another formula."
        },
        {
          "name": "value_if_false",
          "required": false,
          "description": "What to return when it fails. Omit it and you get FALSE, which is rarely what you want in a report."
        }
      ],
      "demo": {
        "file": "Stock levels.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "SKU",
          "Product",
          "Stock",
          "Reorder point"
        ],
        "editable": [
          2,
          3
        ],
        "rows": [
          [
            "SKU-101",
            "Widget",
            140,
            50
          ],
          [
            "SKU-108",
            "Bracket",
            62,
            80
          ],
          [
            "SKU-114",
            "Cable",
            25,
            30
          ],
          [
            "SKU-122",
            "Housing",
            8,
            20
          ],
          [
            "SKU-130",
            "Sensor",
            31,
            25
          ],
          [
            "SKU-145",
            "Adapter",
            54,
            40
          ]
        ],
        "presets": [
          {
            "label": "Simple test",
            "formula": "=IF(C2>D2, \"OK\", \"Reorder\")"
          },
          {
            "label": "Compare two cells",
            "formula": "=IF(C4<D4, \"Below reorder point\", \"Fine\")"
          },
          {
            "label": "Nested test",
            "formula": "=IF(C5=0, \"Out of stock\", IF(C5<D5, \"Reorder\", \"OK\"))"
          },
          {
            "label": "Returning a number",
            "formula": "=IF(C3<D3, D3-C3, 0)"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Text results without quotation marks",
          "body": "Write \"OK\" not OK. Without quotes Excel treats the word as a defined name it cannot find and returns"
        },
        {
          "level": "error",
          "title": "Omitting the third argument",
          "body": "=IF(A2>10,\"High\") returns the word FALSE when the test fails, not a blank. If you want nothing, write \"\" as the third argument. A column of FALSE values in a report looks like a broken formula."
        },
        {
          "level": "warning",
          "title": "Nesting until it is unreadable",
          "body": "More than three levels of IF becomes very hard to follow and to fix. Use IFS instead, or a lookup table. If you are writing the fifth nested IF, the problem is the approach rather than the formula."
        },
        {
          "level": "warning",
          "title": "Testing text with = when case matters",
          "body": "The = comparison ignores case, so \"north\" equals \"North\". If case genuinely matters, use EXACT. Most of the time the case-insensitive behaviour is what you want, but it can hide duplicates you needed to spot."
        }
      ],
      "faq": [
        {
          "q": "How many IFs can I nest?",
          "a": "Excel allows 64 levels. Readability collapses well before that, usually around three. Past that point, use IFS, or put the logic in a lookup table where it can be seen and changed without editing formulas."
        },
        {
          "q": "What is the difference between IF and IFS?",
          "a": "IFS tests conditions in order and returns the first match, without nesting. It is easier to read and to extend, but it needs Excel 2019 or later. IF works everywhere."
        },
        {
          "q": "How do I return a blank cell?",
          "a": "Use \"\" as the result. It looks blank but is technically an empty string, so ISBLANK returns FALSE on it and COUNTA still counts it. That matters if another formula is checking for blanks."
        },
        {
          "q": "Can IF test more than one condition?",
          "a": "Yes, by wrapping the test in AND or OR. For example =IF(AND(A2>10,B2=\"North\"),\"Yes\",\"No\") requires both to be true."
        },
        {
          "q": "Why does my IF always return the same result?",
          "a": "Usually a missing comparison operator, or comparing a number against text. =IF(A2=\"100\",...) will not match a cell containing the number 100. Check with ISNUMBER."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. A straightforward test\n\nCompare stock against the reorder point and label the row.\n\n<Formula>=IF(C2>D2, \"OK\", \"Reorder\")</Formula>\n\nIf stock is above the reorder point, the formula returns OK. Otherwise it returns Reorder. Both results are text, so both need quotation marks.\n\n### 2. Nesting for three outcomes\n\nSometimes two outcomes are not enough. A second IF goes in the false slot of the first.\n\n<Formula>=IF(C5=0, \"Out of stock\", IF(C5<D5, \"Reorder\", \"OK\"))</Formula>\n\nRead it as a sequence: is stock zero? If not, is it below the reorder point? If not, it is fine. Order matters — the first true condition wins, so put the most specific test first.\n\n<Callout type=\"tip\" title=\"Worth knowing\">\nThis is exactly where IFS is clearer, if your users are on Excel 2019 or later. The same logic reads as =IFS(C5=0,\"Out of stock\",C5&lt;D5,\"Reorder\",TRUE,\"OK\") with no nesting at all.\n</Callout>\n\n### 3. Returning a number rather than a label\n\nIF does not have to produce text. Here it calculates a shortfall, or zero if there is not one.\n\n<Formula>=IF(C3<D3, D3-C3, 0)</Formula>\n\nReturning 0 rather than \"\" keeps the column numeric, so you can total it. Mixing text and numbers in one column is what breaks the SUM at the bottom.\n"
  },
  {
    "slug": "iferror",
    "data": {
      "slug": "iferror",
      "name": "IFERROR",
      "category": "Logical",
      "summary": "Catch an error and return something else",
      "description": "IFERROR runs a formula and returns an alternative if that formula produces an error. It makes reports look clean, and it is the function most likely to hide a real problem while doing so.",
      "versions": [
        "Excel 2007 and later"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/invoice-register.xlsx",
      "related": [
        "IF",
        "XLOOKUP",
        "VLOOKUP",
        "INDEX"
      ],
      "syntax": "=IFERROR(value, value_if_error)",
      "arguments": [
        {
          "name": "value",
          "required": true,
          "description": "The formula to try. Usually a lookup or a division."
        },
        {
          "name": "value_if_error",
          "required": true,
          "description": "What to return if it errors. Often \"\" for a blank, a zero, or a readable message."
        }
      ],
      "demo": {
        "file": "Sales analysis.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Rep",
          "Region",
          "Sales",
          "Target"
        ],
        "editable": [
          2,
          3
        ],
        "money": [
          2,
          3
        ],
        "rows": [
          [
            "Ahmed",
            "North",
            42000,
            40000
          ],
          [
            "Brown",
            "South",
            31500,
            35000
          ],
          [
            "Chen",
            "East",
            28900,
            0
          ],
          [
            "Diaz",
            "West",
            51200,
            45000
          ],
          [
            "Evans",
            "North",
            19800,
            25000
          ],
          [
            "Farid",
            "South",
            37400,
            30000
          ]
        ],
        "presets": [
          {
            "label": "Catching a lookup",
            "formula": "=IFERROR(XLOOKUP(\"Gray\", A2:A7, C2:C7), \"Not on the team\")"
          },
          {
            "label": "Catching division by zero",
            "formula": "=IFERROR(C4/D4, \"No target set\")"
          },
          {
            "label": "Returning a blank",
            "formula": "=IFERROR(XLOOKUP(\"Gray\", A2:A7, C2:C7), \"\")"
          },
          {
            "label": "Normal result passes through",
            "formula": "=IFERROR(C2/D2, \"No target set\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Hiding errors you needed to see",
          "body": "IFERROR catches every error type, including"
        },
        {
          "level": "warning",
          "title": "Wrapping before you have debugged",
          "body": "Write the formula, get it working, then wrap it. Wrapping first means you never see the error that would have told you what was wrong, and you end up debugging blind."
        },
        {
          "level": "warning",
          "title": "Returning zero when blank is meant",
          "body": "Returning 0 for a missing lookup puts a real number into your data. Averages then include it and come out wrong. Use \"\" when the value is genuinely absent rather than genuinely zero."
        },
        {
          "level": "warning",
          "title": "Using it to paper over bad data",
          "body": "If a lookup fails on twenty rows, IFERROR turns twenty visible problems into twenty invisible ones. The report looks better and is less true. Fix the data, then tidy the display."
        }
      ],
      "faq": [
        {
          "q": "What is the difference between IFERROR and IFNA?",
          "a": "IFNA catches only"
        },
        {
          "q": "Does IFERROR slow down a large file?",
          "a": "Slightly, because the inner formula is calculated first and only replaced afterwards. On tens of thousands of rows it is noticeable. It is not a reason to avoid it, just a reason not to nest it deeply."
        },
        {
          "q": "Can I use IFERROR with any formula?",
          "a": "Yes, anything that might error. Lookups and divisions are the common cases, but it works with dates, text functions and array formulas equally."
        },
        {
          "q": "What errors does it catch?",
          "a": "All of them —"
        },
        {
          "q": "Should I use IFERROR in a financial model?",
          "a": "Sparingly, and never on the calculation spine. A model that silently returns zero instead of erroring will produce a confident wrong answer, which is worse than a visible failure. Errors in a model are information."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. A lookup that might not find anything\n\n<Formula>=IFERROR(XLOOKUP(\"Gray\", A2:A7, C2:C7), \"Not on the team\")</Formula>\n\nWithout the wrapper this returns #N/A. With it you get a readable message. Note that XLOOKUP has a built-in fourth argument for exactly this, and that version is better because it only catches the not-found case.\n\n### 2. Division where the denominator can be zero\n\n<Formula>=IFERROR(C4/D4, \"No target set\")</Formula>\n\nChen has no target, so the division errors. This is a legitimate use — the error is expected, understood, and the replacement text explains it.\n\n### 3. Returning a blank rather than a message\n\n<Formula>=IFERROR(XLOOKUP(\"Gray\", A2:A7, C2:C7), \"\")</Formula>\n\nIn a wide table, messages are noisier than blanks. The empty string looks like an empty cell but is not one, so ISBLANK returns FALSE and COUNTA still counts it.\n\n<Callout type=\"warning\" title=\"The habit worth forming\">\nReach for IFNA before IFERROR on lookups. It catches the not-found case and lets everything else surface. When a column gets deleted six months from now, you want a visible #REF! rather than a quiet blank that nobody questions.\n</Callout>\n"
  },
  {
    "slug": "ifs",
    "data": {
      "slug": "ifs",
      "name": "IFS",
      "category": "Logical",
      "summary": "Test several conditions in order",
      "description": "IFS checks conditions one after another and returns the result of the first one that is true. It does what nested IF statements do, without the nesting, and is far easier to read six months later.",
      "versions": [
        "Excel 2019 and later"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/invoice-register.xlsx",
      "related": [
        "IF",
        "IFERROR",
        "AND",
        "COUNTIFS"
      ],
      "syntax": "=IFS(condition1, value1, [condition2, value2], ...)",
      "arguments": [
        {
          "name": "condition1",
          "required": true,
          "description": "The first test. If it is true, value1 is returned and nothing else is evaluated."
        },
        {
          "name": "value1",
          "required": true,
          "description": "What to return when condition1 passes."
        },
        {
          "name": "condition2, value2",
          "required": false,
          "description": "Further pairs, tested in order. Up to 127 of them."
        }
      ],
      "demo": {
        "file": "Receivables ageing.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Invoice",
          "Customer",
          "Days overdue",
          "Amount"
        ],
        "editable": [
          2,
          3
        ],
        "money": [
          3
        ],
        "rows": [
          [
            "INV-201",
            "Northgate",
            0,
            4850
          ],
          [
            "INV-202",
            "Bridgeway",
            18,
            12300
          ],
          [
            "INV-203",
            "Castleton",
            44,
            2975
          ],
          [
            "INV-204",
            "Dunmore",
            71,
            18400
          ],
          [
            "INV-205",
            "Eastvale",
            118,
            6220
          ],
          [
            "INV-206",
            "Fairholm",
            9,
            3140
          ]
        ],
        "presets": [
          {
            "label": "Ageing bucket",
            "formula": "=IFS(C2=0, \"Current\", C2<=30, \"1-30 days\", C2<=60, \"31-60 days\", C2<=90, \"61-90 days\", TRUE, \"90+ days\")"
          },
          {
            "label": "A row further down",
            "formula": "=IFS(C5=0, \"Current\", C5<=30, \"1-30 days\", C5<=60, \"31-60 days\", C5<=90, \"61-90 days\", TRUE, \"90+ days\")"
          },
          {
            "label": "Escalation level",
            "formula": "=IFS(C6>90, \"Legal\", C6>60, \"Final notice\", C6>30, \"Reminder\", TRUE, \"None\")"
          },
          {
            "label": "Priority by value",
            "formula": "=IFS(D4>15000, \"High\", D4>5000, \"Medium\", TRUE, \"Low\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "No default when nothing matches",
          "body": "IFS has no else. If every condition is false you get"
        },
        {
          "level": "error",
          "title": "Not available in Excel 2016",
          "body": "IFS arrived in Excel 2019. Earlier versions return"
        },
        {
          "level": "warning",
          "title": "Conditions in the wrong order",
          "body": "The first true condition wins and the rest are never evaluated. Testing C2<=90 before C2<=30 means everything under 30 is caught by the wrong branch. Order from most specific to least."
        },
        {
          "level": "warning",
          "title": "Overlapping bands that hide a bug",
          "body": "Because only the first match counts, overlapping conditions do not error — they silently pick one. That makes a wrong boundary very hard to spot. Check the edges deliberately, especially the zero case."
        }
      ],
      "faq": [
        {
          "q": "What is the difference between IFS and nested IF?",
          "a": "They do the same job. IFS is flat and reads top to bottom, nested IF is layered and needs careful bracket counting. IFS is clearer above two or three conditions, but it requires Excel 2019."
        },
        {
          "q": "How do I add an else?",
          "a": "Make TRUE the last condition. =IFS(A2>10,\"big\",TRUE,\"small\") returns small for anything not caught earlier, because TRUE always evaluates to true."
        },
        {
          "q": "Does IFS evaluate every condition?",
          "a": "No. It stops at the first true one. That matters if a later condition would error — it will never be reached, so no error appears."
        },
        {
          "q": "Can I use IFS for a lookup?",
          "a": "You can, but you should not for more than a handful of values. A lookup table with XLOOKUP or INDEX/MATCH is easier to change, because the values live in cells rather than inside a formula."
        },
        {
          "q": "What if two conditions are both true?",
          "a": "The first one wins. This is useful when you order from most to least specific, and a trap when you did not intend the overlap."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Ageing buckets\n\nThe classic use, and a genuine improvement on nested IF.\n\n<Formula>=IFS(C2=0, \"Current\", C2<=30, \"1-30 days\", C2<=60, \"31-60 days\", C2<=90, \"61-90 days\", TRUE, \"90+ days\")</Formula>\n\nRead it top to bottom: is it zero? Under thirty? Under sixty? The first match wins. Written as nested IF this needs four levels of brackets and considerably more care.\n\n### 2. Order matters\n\n<Formula>=IFS(C6>90, \"Legal\", C6>60, \"Final notice\", C6>30, \"Reminder\", TRUE, \"None\")</Formula>\n\nHere the conditions run from largest to smallest. Reverse them and everything over 30 days would be caught by the first test and labelled Reminder, including the 118-day invoice.\n\n<Callout type=\"warning\" title=\"Always end with TRUE\">\nWithout a final TRUE, any row that matches nothing returns #N/A. In a report that looks like a broken formula rather than an unhandled case. Make the catch-all explicit.\n</Callout>\n\n### 3. Banding on value rather than age\n\n<Formula>=IFS(D4>15000, \"High\", D4>5000, \"Medium\", TRUE, \"Low\")</Formula>\n\nThe same pattern applied to amounts. Three bands, ordered from highest, with a catch-all at the end.\n"
  },
  {
    "slug": "index",
    "data": {
      "slug": "index",
      "name": "INDEX",
      "category": "Lookup",
      "summary": "Return a value at a position",
      "description": "INDEX returns the value at a given position in a range. On its own it is rarely useful. Paired with MATCH it becomes the most flexible lookup in Excel, works in every version, and does not break when columns move.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 6,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/inventory-tracker.xlsx",
      "related": [
        "MATCH",
        "XLOOKUP",
        "VLOOKUP",
        "IFERROR"
      ],
      "syntax": "=INDEX(array, row_num, [column_num])",
      "arguments": [
        {
          "name": "array",
          "required": true,
          "description": "The range to pull a value from."
        },
        {
          "name": "row_num",
          "required": true,
          "description": "Which row of that range, counted from its first row. Row 1 is the first row of the range, not of the sheet."
        },
        {
          "name": "column_num",
          "required": false,
          "description": "Which column, when the range spans more than one. Omit it for a single-column range."
        }
      ],
      "demo": {
        "file": "Product catalogue.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "SKU",
          "Product",
          "Price",
          "Stock"
        ],
        "editable": [
          2,
          3
        ],
        "money": [
          2
        ],
        "rows": [
          [
            "SKU-101",
            "Widget",
            24.5,
            140
          ],
          [
            "SKU-108",
            "Bracket",
            8.75,
            62
          ],
          [
            "SKU-114",
            "Cable",
            15.2,
            25
          ],
          [
            "SKU-122",
            "Housing",
            47,
            8
          ],
          [
            "SKU-130",
            "Sensor",
            112.4,
            31
          ],
          [
            "SKU-145",
            "Adapter",
            19.9,
            54
          ]
        ],
        "presets": [
          {
            "label": "Third price",
            "formula": "=INDEX(C2:C7, 3)"
          },
          {
            "label": "Row and column",
            "formula": "=INDEX(A2:D7, 4, 2)"
          },
          {
            "label": "With MATCH",
            "formula": "=INDEX(C2:C7, MATCH(\"SKU-130\", A2:A7, 0))"
          },
          {
            "label": "Looking leftwards",
            "formula": "=INDEX(B2:B7, MATCH(47, C2:C7, 0))"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Counting rows from the sheet rather than the range",
          "body": "INDEX counts from the first row of the range you gave it. In =INDEX(C2:C7,3) the 3 means the third row of C2:C7, which is C4 — not row 3 of the worksheet. Getting this wrong returns a real value from the wrong row, so nothing errors."
        },
        {
          "level": "error",
          "title": "Row number larger than the range",
          "body": "=INDEX(C2:C7,9) returns"
        },
        {
          "level": "warning",
          "title": "The two ranges must line up",
          "body": "With INDEX and MATCH, the range MATCH searches and the range INDEX returns from must start on the same row and be the same length. A2:A7 with C2:C50 returns the wrong row without any error."
        },
        {
          "level": "warning",
          "title": "Forgetting the column number on a multi-column range",
          "body": "Give INDEX a range spanning several columns and omit column_num, and it returns the first column. That is a valid result, so no error appears — just the wrong field."
        }
      ],
      "faq": [
        {
          "q": "Why use INDEX and MATCH instead of VLOOKUP?",
          "a": "Three reasons. It can look left as well as right, it does not break when a column is inserted, and it works in every version of Excel. The cost is that the formula is longer and takes a moment to read."
        },
        {
          "q": "Is INDEX/MATCH still worth learning now XLOOKUP exists?",
          "a": "Yes, for compatibility. XLOOKUP returns"
        },
        {
          "q": "How does INDEX return a whole row or column?",
          "a": "Pass 0 as the row or column number. =INDEX(A2:D7,0,2) returns the entire second column as an array. This is more useful inside other functions than on its own."
        },
        {
          "q": "Can INDEX return a range rather than a value?",
          "a": "Yes, which is how dynamic ranges are built. =SUM(A2:INDEX(A2:A100,10)) sums the first ten rows. It is a specialist use but a genuinely powerful one."
        },
        {
          "q": "Why does my INDEX/MATCH return",
          "a": "The"
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. On its own\n\nReturn the third value in a range.\n\n<Formula>=INDEX(C2:C7, 3)</Formula>\n\nThe 3 counts from the start of C2:C7, so it returns the value in C4. This is rarely useful by itself because you have to know the position in advance.\n\n### 2. Row and column together\n\nGive INDEX a block and it needs both coordinates.\n\n<Formula>=INDEX(A2:D7, 4, 2)</Formula>\n\nFourth row, second column of the block — the product name on the Housing row.\n\n### 3. The pairing that matters\n\nMATCH finds the position, INDEX returns the value at it. This is the combination worth committing to memory.\n\n<Formula>=INDEX(C2:C7, MATCH(\"SKU-130\", A2:A7, 0))</Formula>\n\nMATCH looks for SKU-130 in column A and returns 5. INDEX then returns the fifth price. Insert a column anywhere and both ranges adjust automatically, which is precisely what VLOOKUP cannot do.\n\n<Callout type=\"tip\" title=\"The direction advantage\">\nBecause the two ranges are independent, INDEX can return from a column to the left of the one being searched. =INDEX(B2:B7, MATCH(47, C2:C7, 0)) finds a price and returns the product name beside it. VLOOKUP cannot do this at all.\n</Callout>\n"
  },
  {
    "slug": "left",
    "data": {
      "slug": "left",
      "name": "LEFT",
      "category": "Text",
      "summary": "Take characters from the left",
      "description": "LEFT returns a set number of characters from the start of a piece of text. With RIGHT and MID it covers most of the work of pulling codes, prefixes and fixed-width fields out of imported data.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/inventory-tracker.xlsx",
      "related": [
        "MID",
        "TRIM",
        "SUBSTITUTE",
        "TEXTJOIN"
      ],
      "syntax": "=LEFT(text, [num_chars])",
      "arguments": [
        {
          "name": "text",
          "required": true,
          "description": "The text to take from."
        },
        {
          "name": "num_chars",
          "required": false,
          "description": "How many characters. Omit it and you get one. Ask for more than there are and you get the whole string, with no error."
        }
      ],
      "demo": {
        "file": "Product codes.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Full code",
          "Description",
          "Unit cost",
          "Quantity"
        ],
        "editable": [
          2,
          3
        ],
        "money": [
          2
        ],
        "rows": [
          [
            "FIX-101-NORTH",
            "M8 bracket",
            8.75,
            140
          ],
          [
            "RAW-208-SOUTH",
            "Steel sheet",
            42,
            62
          ],
          [
            "CON-114-NORTH",
            "Cutting fluid",
            15.2,
            25
          ],
          [
            "FIX-322-EAST",
            "Hex bolt",
            2.4,
            880
          ],
          [
            "PKG-430-NORTH",
            "Carton 300mm",
            1.15,
            1200
          ],
          [
            "RAW-145-WEST",
            "Aluminium bar",
            19.9,
            54
          ]
        ],
        "presets": [
          {
            "label": "Category prefix",
            "formula": "=LEFT(A2, 3)"
          },
          {
            "label": "Just one character",
            "formula": "=LEFT(A3)"
          },
          {
            "label": "The numeric part",
            "formula": "=MID(A2, 5, 3)"
          },
          {
            "label": "More than exists",
            "formula": "=LEFT(B4, 100)"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "The result is text, even when it looks like a number",
          "body": "=LEFT(\"2026-01\",4) returns the text \"2026\", not the number 2026. It will not add up and will not match a numeric lookup. Wrap it in VALUE when you need a number."
        },
        {
          "level": "warning",
          "title": "Assuming a fixed width that is not fixed",
          "body": "LEFT(A2,3) works while every code has a three-character prefix. One record with a two-character prefix returns the wrong thing and nothing errors. If the length varies, find the separator with FIND rather than hardcoding a count."
        },
        {
          "level": "warning",
          "title": "Leading spaces count as characters",
          "body": "On text with a leading space, LEFT returns the space plus one fewer real character. Wrap the source in TRIM first when the data came from an export."
        },
        {
          "level": "warning",
          "title": "Asking for more characters than exist",
          "body": "This does not error — it quietly returns the whole string. That makes an incorrect count harder to spot than it should be, because the result still looks reasonable."
        }
      ],
      "faq": [
        {
          "q": "How do I split text at a separator rather than a fixed position?",
          "a": "Combine with FIND. =LEFT(A2,FIND(\"-\",A2)-1) returns everything before the first hyphen, however long it is. The minus one drops the hyphen itself."
        },
        {
          "q": "What is the difference between LEFT, RIGHT and MID?",
          "a": "LEFT counts from the start, RIGHT from the end, and MID from a position you specify. MID can do all three jobs but the other two are clearer when they fit."
        },
        {
          "q": "How do I get the last part of a code?",
          "a": "=RIGHT(A2,LEN(A2)-FIND(\"-\",A2)) for a single separator. With several separators it becomes awkward — Text to Columns or Power Query is the better tool."
        },
        {
          "q": "Why does my LEFT result not match in a lookup?",
          "a": "Because it is text. If the lookup column holds real numbers, =VALUE(LEFT(A2,4)) converts it. Numbers and text that look identical never match."
        },
        {
          "q": "Is there a SPLIT function?",
          "a": "TEXTSPLIT exists in Excel 365 and does exactly this. In earlier versions, LEFT, RIGHT, MID and FIND together are the standard approach."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Pulling a category prefix\n\n<Formula>=LEFT(A2, 3)</Formula>\n\nEvery code here begins with a three-letter category. LEFT returns FIX, RAW, CON or PKG, which can then be grouped or looked up.\n\n### 2. The default\n\n<Formula>=LEFT(A3)</Formula>\n\nOmit the count and you get one character. Rarely useful on its own, but it explains why a LEFT with a missing argument returns a single letter rather than erroring.\n\n### 3. Reaching into the middle\n\n<Formula>=MID(A2, 5, 3)</Formula>\n\nLEFT cannot skip. MID starts at a position and takes a length, so this returns the three-digit number after the prefix and hyphen.\n\n<Callout type=\"tip\" title=\"When the width is not fixed\">\nHardcoding a character count only works while every value has the same shape. =LEFT(A2, FIND(\"-\",A2)-1) finds the first hyphen and takes everything before it, so it keeps working when a prefix is two characters or four. Worth the extra length in anything that will be reused.\n</Callout>\n"
  },
  {
    "slug": "match",
    "data": {
      "slug": "match",
      "name": "MATCH",
      "category": "Lookup",
      "summary": "Find the position of a value",
      "description": "MATCH searches a range for a value and returns its position as a number, not the value itself. That sounds unhelpful until you feed the position into INDEX, which is where nearly all of its usefulness lies.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/inventory-tracker.xlsx",
      "related": [
        "INDEX",
        "XLOOKUP",
        "VLOOKUP",
        "COUNTIFS"
      ],
      "syntax": "=MATCH(lookup_value, lookup_array, [match_type])",
      "arguments": [
        {
          "name": "lookup_value",
          "required": true,
          "description": "The value to find."
        },
        {
          "name": "lookup_array",
          "required": true,
          "description": "A single row or column to search. Not a two-dimensional block."
        },
        {
          "name": "match_type",
          "required": false,
          "description": "0 for an exact match. 1 finds the largest value at or below and needs ascending data. -1 finds the smallest at or above and needs descending data. Defaults to 1, which is almost never what you want."
        }
      ],
      "demo": {
        "file": "Product catalogue.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "SKU",
          "Product",
          "Price",
          "Stock"
        ],
        "editable": [
          2,
          3
        ],
        "money": [
          2
        ],
        "rows": [
          [
            "SKU-101",
            "Widget",
            24.5,
            140
          ],
          [
            "SKU-108",
            "Bracket",
            8.75,
            62
          ],
          [
            "SKU-114",
            "Cable",
            15.2,
            25
          ],
          [
            "SKU-122",
            "Housing",
            47,
            8
          ],
          [
            "SKU-130",
            "Sensor",
            112.4,
            31
          ],
          [
            "SKU-145",
            "Adapter",
            19.9,
            54
          ]
        ],
        "presets": [
          {
            "label": "Find a position",
            "formula": "=MATCH(\"SKU-122\", A2:A7, 0)"
          },
          {
            "label": "Match on a number",
            "formula": "=MATCH(112.4, C2:C7, 0)"
          },
          {
            "label": "Feed it into INDEX",
            "formula": "=INDEX(B2:B7, MATCH(\"SKU-145\", A2:A7, 0))"
          },
          {
            "label": "Not found",
            "formula": "=MATCH(\"SKU-999\", A2:A7, 0)"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Leaving out the zero",
          "body": "Omit match_type and it defaults to 1, an approximate match that assumes sorted data. On unsorted data the result is arbitrary and no error appears. Write 0 unless you specifically want banding."
        },
        {
          "level": "error",
          "title": "Searching a two-dimensional range",
          "body": "MATCH takes a single row or column. Give it A2:D7 and you get"
        },
        {
          "level": "warning",
          "title": "The position is relative to the range",
          "body": "MATCH returns the position within the range you gave it, not the worksheet row. Searching A2:A7 for the first item returns 1, not 2. Mixing this up shifts every INDEX result by one row."
        },
        {
          "level": "warning",
          "title": "Duplicates return only the first",
          "body": "MATCH stops at the first hit. If the value appears more than once, later occurrences are invisible. Use COUNTIFS to check for duplicates before relying on the result."
        }
      ],
      "faq": [
        {
          "q": "What does MATCH actually return?",
          "a": "A position number. Searching A2:A7 and finding the value in A4 returns 3, because A4 is the third cell in that range. It never returns the value itself."
        },
        {
          "q": "Why combine MATCH with INDEX?",
          "a": "MATCH finds where something is, INDEX returns what is there. Together they do what VLOOKUP does, but in any direction and without breaking when columns move."
        },
        {
          "q": "Can MATCH find a partial match?",
          "a": "Yes, with wildcards and match_type 0. \"SKU-1*\" matches the first SKU beginning with SKU-1. Wildcards only work on text."
        },
        {
          "q": "How do I find the last occurrence rather than the first?",
          "a": "There is no direct option. XLOOKUP has a search_mode of -1 that searches backwards. In older Excel it takes an array formula, which is a good sign the data should be restructured instead."
        },
        {
          "q": "Why does MATCH return",
          "a": "The values are not identical. A trailing space, a number stored as text, or a non-breaking space from a web page all look the same on screen. Test with =ISNUMBER() or compare lengths with =LEN()."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Finding a position\n\n<Formula>=MATCH(\"SKU-122\", A2:A7, 0)</Formula>\n\nReturns 4, because SKU-122 is the fourth entry in A2:A7. The zero forces an exact match, which is what you want almost every time.\n\n### 2. Matching a number\n\n<Formula>=MATCH(112.4, C2:C7, 0)</Formula>\n\nWorks the same way on numbers. Note that a value stored as text will not match a number, even when they look identical on screen.\n\n### 3. Where it earns its place\n\n<Formula>=INDEX(B2:B7, MATCH(\"SKU-145\", A2:A7, 0))</Formula>\n\nMATCH finds the row, INDEX returns the product name from that row. This pattern is worth learning by heart — it is the compatible equivalent of XLOOKUP and it does not care which direction it reads in.\n\n<Callout type=\"tip\" title=\"Debugging tip\">\nWhen an INDEX/MATCH fails, split it up. Put the MATCH in its own cell and see what it returns. If it gives #N/A, the problem is the lookup value or the data. If it returns a number, the problem is the INDEX range.\n</Callout>\n"
  },
  {
    "slug": "networkdays",
    "data": {
      "slug": "networkdays",
      "name": "NETWORKDAYS",
      "category": "Date",
      "summary": "Count working days between dates",
      "description": "NETWORKDAYS counts the working days between two dates, excluding weekends and any holidays you supply. It is the right way to measure turnaround time, because calendar days flatter or penalise depending on which day of the week something landed.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/timesheet.xlsx",
      "related": [
        "DATEDIF",
        "EOMONTH",
        "DATE",
        "IF"
      ],
      "syntax": "=NETWORKDAYS(start_date, end_date, [holidays])",
      "arguments": [
        {
          "name": "start_date",
          "required": true,
          "description": "The first day. It is included in the count if it is a working day."
        },
        {
          "name": "end_date",
          "required": true,
          "description": "The last day. Also included if it is a working day."
        },
        {
          "name": "holidays",
          "required": false,
          "description": "A range of dates to exclude as well as weekends. Usually a list on another sheet."
        }
      ],
      "demo": {
        "file": "Job turnaround.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Job",
          "Received",
          "Completed",
          "Value"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "dates": [
          1,
          2
        ],
        "rows": [
          [
            "JOB-401",
            46037,
            46041,
            2400
          ],
          [
            "JOB-402",
            46038,
            46045,
            5100
          ],
          [
            "JOB-403",
            46042,
            46042,
            900
          ],
          [
            "JOB-404",
            46044,
            46058,
            12750
          ],
          [
            "JOB-405",
            46050,
            46064,
            3300
          ],
          [
            "JOB-406",
            46052,
            46053,
            1850
          ]
        ],
        "presets": [
          {
            "label": "Working days",
            "formula": "=NETWORKDAYS(B2, C2)"
          },
          {
            "label": "Across a weekend",
            "formula": "=NETWORKDAYS(B3, C3)"
          },
          {
            "label": "Same day",
            "formula": "=NETWORKDAYS(B4, C4)"
          },
          {
            "label": "Calendar days for comparison",
            "formula": "=C5-B5"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Both ends are included",
          "body": "NETWORKDAYS counts the start and end dates, so Monday to Monday returns 1, not 0. For elapsed working days after the start, subtract one. Whether the boundary counts is a business question, not a formula question — decide it before writing anything."
        },
        {
          "level": "warning",
          "title": "Weekends are assumed to be Saturday and Sunday",
          "body": "NETWORKDAYS hardcodes the Western weekend. In much of the Middle East and parts of South Asia the working week differs. Use NETWORKDAYS.INTL, whose third argument lets you specify which days are weekends."
        },
        {
          "level": "warning",
          "title": "Forgetting public holidays",
          "body": "Without the third argument, a national holiday counts as a working day and your turnaround looks better than it was. Keep a holiday list on a separate sheet and reference it consistently."
        },
        {
          "level": "warning",
          "title": "The result shows as a date",
          "body": "If the cell was previously formatted as a date, a count of 5 displays as a date in January 1900. Set the cell to General or Number. The formula is right; the format is not."
        }
      ],
      "faq": [
        {
          "q": "Does NETWORKDAYS include the start and end dates?",
          "a": "Yes, both, when they are working days. Monday to Friday returns 5. If you want days elapsed rather than days worked, subtract one."
        },
        {
          "q": "How do I handle a different working week?",
          "a": "Use NETWORKDAYS.INTL. Its third argument selects the weekend pattern — 7 for Friday and Saturday, for example — or takes a seven-character string of ones and zeros for full control."
        },
        {
          "q": "How do I add working days rather than count them?",
          "a": "WORKDAY does the reverse. =WORKDAY(A2,10,holidays) returns the date ten working days after A2, which is how service-level deadlines are calculated."
        },
        {
          "q": "Where should the holiday list live?",
          "a": "On its own sheet, as a single column of dates, referenced absolutely so it does not shift when the formula is copied. Keeping it in one place means one edit a year rather than many."
        },
        {
          "q": "Why does my result look wrong by one?",
          "a": "Almost always the inclusive boundary. Check whether your business counts the day of receipt as day zero or day one, and be consistent about it across every report."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. A straightforward turnaround\n\n<Formula>=NETWORKDAYS(B2, C2)</Formula>\n\nReceived on a Thursday, completed the following Monday. NETWORKDAYS returns 3 rather than the 4 calendar days, because the weekend does not count.\n\n### 2. Where the difference shows\n\n<Formula>=NETWORKDAYS(B3, C3)</Formula>\n\nA job spanning a full weekend has the same calendar duration as one that does not, but a materially different working duration. This is exactly why turnaround measured in calendar days misleads.\n\n### 3. Same day\n\n<Formula>=NETWORKDAYS(B4, C4)</Formula>\n\nStart and end on the same working day returns 1, because both ends are included. If your definition of same-day turnaround is zero days, subtract one.\n\n<Callout type=\"warning\" title=\"Check the working week\">\nNETWORKDAYS assumes Saturday and Sunday are the weekend. That is wrong in much of the Middle East and in parts of South Asia, where Friday is the common rest day. NETWORKDAYS.INTL takes a weekend code as its third argument and should be the default for anything crossing regions.\n</Callout>\n"
  },
  {
    "slug": "round",
    "data": {
      "slug": "round",
      "name": "ROUND",
      "category": "Math",
      "summary": "Round to a set number of decimals",
      "description": "ROUND rounds a number to the number of decimal places you specify. The important thing about it is that it changes the value, not just the display — which is precisely why totals reconcile with it and do not without it.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/budget-vs-actual.xlsx",
      "related": [
        "SUMPRODUCT",
        "SUMIFS",
        "IF",
        "ABS"
      ],
      "syntax": "=ROUND(number, num_digits)",
      "arguments": [
        {
          "name": "number",
          "required": true,
          "description": "The value to round."
        },
        {
          "name": "num_digits",
          "required": true,
          "description": "How many decimal places. 2 for currency, 0 for whole numbers, and negative values to round to tens, hundreds or thousands."
        }
      ],
      "demo": {
        "file": "Invoice lines.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Item",
          "Quantity",
          "Unit price",
          "Tax rate"
        ],
        "editable": [
          1,
          2
        ],
        "money": [
          2
        ],
        "rows": [
          [
            "Widget",
            7,
            24.499,
            0.175
          ],
          [
            "Bracket",
            13,
            8.755,
            0.175
          ],
          [
            "Cable",
            3,
            15.204,
            0.05
          ],
          [
            "Housing",
            11,
            46.996,
            0.175
          ],
          [
            "Sensor",
            2,
            112.405,
            0.175
          ],
          [
            "Adapter",
            9,
            19.909,
            0.05
          ]
        ],
        "presets": [
          {
            "label": "To two decimals",
            "formula": "=ROUND(C2, 2)"
          },
          {
            "label": "Line total rounded",
            "formula": "=ROUND(B2 * C2, 2)"
          },
          {
            "label": "To whole numbers",
            "formula": "=ROUND(C6, 0)"
          },
          {
            "label": "To the nearest hundred",
            "formula": "=ROUND(B4 * C4, -2)"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Confusing rounding with formatting",
          "body": "Changing the decimal places shown on screen does not change the value. The cell still holds 24.499 and still adds up as 24.499. This is why a column of neatly formatted figures can total something other than the sum of what you see. ROUND changes the value itself."
        },
        {
          "level": "warning",
          "title": "Rounding too early",
          "body": "Rounding each intermediate step compounds the loss. Calculate at full precision and round once at the end, unless the business rule genuinely requires rounding at each line — as tax rules often do."
        },
        {
          "level": "warning",
          "title": "Excel rounds half away from zero",
          "body": "ROUND(0.5,0) gives 1 and ROUND(-0.5,0) gives -1. That is not banker's rounding, which would round half to the nearest even number. For statutory reporting, check which convention applies before assuming."
        },
        {
          "level": "warning",
          "title": "Floating point makes some halves round unexpectedly",
          "body": "Computers cannot store every decimal exactly, so a value displaying as 2.675 may be fractionally under it and round to 2.67. This is not an Excel bug and no spreadsheet avoids it. Where it matters, round the inputs rather than the result."
        }
      ],
      "faq": [
        {
          "q": "What is the difference between ROUND and formatting?",
          "a": "Formatting changes what you see and nothing else. ROUND changes the stored value. If your totals disagree with the figures on screen, formatting is the reason and ROUND is the fix."
        },
        {
          "q": "When should I use ROUNDUP or ROUNDDOWN?",
          "a": "When the direction matters regardless of the digit. ROUNDUP for quantities that must cover a requirement, ROUNDDOWN for anything that must not overstate. Both take the same arguments as ROUND."
        },
        {
          "q": "What does a negative num_digits do?",
          "a": "It rounds to the left of the decimal point. -2 rounds to the nearest hundred, -3 to the nearest thousand. This is how figures are presented in thousands in a report."
        },
        {
          "q": "Why does my rounded column still not total correctly?",
          "a": "Because the total is the sum of unrounded values. Either round each line and sum the rounded ones, or sum first and round the total. Which is right depends on your rules — but pick one and be consistent."
        },
        {
          "q": "Does ROUND affect performance?",
          "a": "Negligibly. It is one of the cheapest functions in Excel. Do not avoid it for performance reasons."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. To two decimal places\n\n<Formula>=ROUND(C2, 2)</Formula>\n\n24.499 becomes 24.50. Note the value has genuinely changed — this cell will now add up as 24.50, unlike a cell that merely displays two decimals.\n\n### 2. Rounding a calculation\n\n<Formula>=ROUND(B2 * C2, 2)</Formula>\n\nQuantity times price, rounded to the penny. Doing this at line level is what makes an invoice total match the sum of its lines, which is exactly what a customer or an auditor will check.\n\n### 3. Negative digits\n\n<Formula>=ROUND(B4 * C4, -2)</Formula>\n\nA negative number of digits rounds to the left of the decimal point. Minus two gives the nearest hundred, which is how summary figures get presented without a helper column of divisions.\n\n<Callout type=\"warning\" title=\"The reconciliation trap\">\nA column formatted to two decimals but holding unrounded values will not total to the sum of what is displayed. Nothing errors — the report is simply out by a few pence and nobody can find why. If a total has to agree to the visible lines, round the values rather than the format.\n</Callout>\n"
  },
  {
    "slug": "sort",
    "data": {
      "slug": "sort",
      "name": "SORT",
      "category": "Dynamic array",
      "summary": "Sort a range by any column",
      "description": "SORT returns a sorted copy of a range, spilling into the cells below and updating itself as the source changes. Unlike the Sort button it does not touch the original data, which makes it safe to use on something other people rely on.",
      "versions": [
        "Excel 365",
        "Excel 2021"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/kpi-dashboard.xlsx",
      "related": [
        "FILTER",
        "UNIQUE",
        "MAXIFS",
        "INDEX"
      ],
      "syntax": "=SORT(array, [sort_index], [sort_order], [by_col])",
      "arguments": [
        {
          "name": "array",
          "required": true,
          "description": "The range to sort."
        },
        {
          "name": "sort_index",
          "required": false,
          "description": "Which column to sort by, counted from the first column of the array. Defaults to 1."
        },
        {
          "name": "sort_order",
          "required": false,
          "description": "1 for ascending, -1 for descending. Defaults to 1."
        },
        {
          "name": "by_col",
          "required": false,
          "description": "FALSE sorts rows, TRUE sorts columns. Rows is the default and almost always what you want."
        }
      ],
      "demo": {
        "file": "Q3 regional sales.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Order",
          "Region",
          "Status",
          "Amount"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "rows": [
          [
            "#1041",
            "North",
            "Closed",
            12400
          ],
          [
            "#1042",
            "South",
            "Open",
            8100
          ],
          [
            "#1043",
            "North",
            "Open",
            9600
          ],
          [
            "#1044",
            "North",
            "Closed",
            15250
          ],
          [
            "#1045",
            "East",
            "Closed",
            7300
          ],
          [
            "#1046",
            "North",
            "Closed",
            4880
          ]
        ],
        "presets": [
          {
            "label": "Largest value",
            "formula": "=MAX(D2:D7)"
          },
          {
            "label": "Smallest value",
            "formula": "=MIN(D2:D7)"
          },
          {
            "label": "Largest in the North",
            "formula": "=MAXIFS(D2:D7, B2:B7, \"North\")"
          },
          {
            "label": "Which order is largest",
            "formula": "=INDEX(A2:A7, MATCH(MAX(D2:D7), D2:D7, 0))"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Not available before Excel 2021",
          "body": "SORT returns"
        },
        {
          "level": "error",
          "title": "The spill range is blocked",
          "body": "SORT needs empty cells for its output. Anything in the way gives"
        },
        {
          "level": "warning",
          "title": "sort_index counts from the array, not the sheet",
          "body": "Sorting C2:F7 by column 2 sorts by column D, not column B. The index is relative to the range you passed in, which is the same trap INDEX sets."
        },
        {
          "level": "warning",
          "title": "Sorting a range that includes headers",
          "body": "Include the header row in the array and it gets sorted along with the data, usually ending up somewhere in the middle. Start the array below the headers."
        }
      ],
      "faq": [
        {
          "q": "Why does the demo use MAX rather than SORT?",
          "a": "The interactive grid evaluates one formula into one cell, and SORT spills a whole table. The presets show the related single-value answers. SORT itself is best tried in Excel where the spill is visible."
        },
        {
          "q": "How do I sort by more than one column?",
          "a": "Pass arrays for sort_index and sort_order — =SORT(A2:D7,{2,4},{1,-1}) sorts by column 2 ascending then column 4 descending. The braces make an array constant."
        },
        {
          "q": "What is SORTBY?",
          "a": "SORTBY sorts one range according to the values in another, including a column that is not part of the output. Use it when the sort key should not appear in the result."
        },
        {
          "q": "Does SORT change my original data?",
          "a": "No, and that is the main advantage. It produces a sorted copy elsewhere. The Sort button rearranges the data in place, which is irreversible once saved."
        },
        {
          "q": "How do I get just the top five?",
          "a": "Combine with TAKE in Excel 365 — =TAKE(SORT(A2:D7,4,-1),5). In Excel 2021 use LARGE with INDEX and MATCH, or sort and reference the first five rows."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. The largest value\n\n<Formula>=MAX(D2:D7)</Formula>\n\nIn Excel, `=SORT(A2:D7, 4, -1)` would return the whole table ordered by amount, largest first. The grid above shows single values instead, because it evaluates one formula into one cell.\n\n### 2. Conditional maximum\n\n<Formula>=MAXIFS(D2:D7, B2:B7, \"North\")</Formula>\n\nThe largest order within one region. MAXIFS answers a narrower question than SORT but works in Excel 2019 and needs no spill space.\n\n### 3. Finding which row holds the maximum\n\n<Formula>=INDEX(A2:A7, MATCH(MAX(D2:D7), D2:D7, 0))</Formula>\n\nThis is the pattern for \"which one is biggest\" rather than \"how big is the biggest\". MAX finds the value, MATCH finds its position, INDEX returns the label. It works in every version of Excel.\n\n<Callout type=\"tip\" title=\"Sorting without touching the data\">\nThe real advantage of SORT is that it leaves the source alone. On a shared workbook, using the Sort button rearranges rows for everyone, permanently, and there is no record of what the order used to be. A SORT formula in a separate area gives you the view you need without that risk.\n</Callout>\n"
  },
  {
    "slug": "substitute",
    "data": {
      "slug": "substitute",
      "name": "SUBSTITUTE",
      "category": "Text",
      "summary": "Replace text inside a string",
      "description": "SUBSTITUTE swaps one piece of text for another inside a cell. Unlike Find and Replace it leaves the original untouched, which makes it the right tool for cleaning data that arrives the same way every month.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/kpi-dashboard.xlsx",
      "related": [
        "TRIM",
        "LEFT",
        "LEN",
        "TEXTJOIN"
      ],
      "syntax": "=SUBSTITUTE(text, old_text, new_text, [instance_num])",
      "arguments": [
        {
          "name": "text",
          "required": true,
          "description": "The text to work on."
        },
        {
          "name": "old_text",
          "required": true,
          "description": "What to look for. Case sensitive."
        },
        {
          "name": "new_text",
          "required": true,
          "description": "What to put in its place. Use \"\" to delete."
        },
        {
          "name": "instance_num",
          "required": false,
          "description": "Which occurrence to replace. Omit it and every occurrence is replaced."
        }
      ],
      "demo": {
        "file": "Imported ledger.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Reference",
          "Description",
          "Amount",
          "Account"
        ],
        "editable": [
          2
        ],
        "money": [
          2
        ],
        "rows": [
          [
            "REF/2026/0041",
            "Sales - North region",
            12400,
            "AC-4000"
          ],
          [
            "REF/2026/0042",
            "Sales - South region",
            8100,
            "AC-4000"
          ],
          [
            "REF/2026/0043",
            "Rent - Q1",
            9600,
            "AC-5200"
          ],
          [
            "REF/2026/0044",
            "Sales - North region",
            15250,
            "AC-4000"
          ],
          [
            "REF/2026/0045",
            "Utilities - Q1",
            7300,
            "AC-5210"
          ],
          [
            "REF/2026/0046",
            "Sales - East region",
            4880,
            "AC-4000"
          ]
        ],
        "presets": [
          {
            "label": "Change a separator",
            "formula": "=SUBSTITUTE(A2, \"/\", \"-\")"
          },
          {
            "label": "Delete text",
            "formula": "=SUBSTITUTE(A2, \"REF/\", \"\")"
          },
          {
            "label": "One occurrence only",
            "formula": "=SUBSTITUTE(A2, \"/\", \"-\", 2)"
          },
          {
            "label": "Tidy a description",
            "formula": "=SUBSTITUTE(B3, \" - \", \": \")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "It is case sensitive",
          "body": "SUBSTITUTE(\"North\",\"north\",\"South\") changes nothing, because the case does not match. REPLACE is not an alternative — it works on positions rather than content. To ignore case you have to normalise with UPPER or LOWER first."
        },
        {
          "level": "warning",
          "title": "Replacing every occurrence when you meant one",
          "body": "Without the fourth argument, every match is replaced. On a reference like REF/2026/0041 that turns all the separators, not just the first. Use instance_num when position matters."
        },
        {
          "level": "warning",
          "title": "Confusing SUBSTITUTE with REPLACE",
          "body": "SUBSTITUTE finds text and swaps it. REPLACE swaps a fixed number of characters at a fixed position, regardless of content. They solve different problems and are easy to reach for in the wrong order."
        },
        {
          "level": "warning",
          "title": "The result is always text",
          "body": "Stripping a currency symbol leaves you with text that looks like a number. Wrap it in VALUE if you need to add it up, or the SUM below will quietly ignore it."
        }
      ],
      "faq": [
        {
          "q": "What is the difference between SUBSTITUTE and REPLACE?",
          "a": "SUBSTITUTE works on content — find this text, swap it. REPLACE works on position — swap four characters starting at position three. Use SUBSTITUTE unless you genuinely know the position and not the content."
        },
        {
          "q": "How do I remove several different characters?",
          "a": "Nest them. =SUBSTITUTE(SUBSTITUTE(A2,\"(\",\"\"),\")\",\"\") removes both brackets. It gets unwieldy past three or four, at which point Power Query is the better answer."
        },
        {
          "q": "How do I make it ignore case?",
          "a": "Normalise first. =SUBSTITUTE(UPPER(A2),\"NORTH\",\"SOUTH\") matches regardless of the original case, though the result is now uppercase throughout."
        },
        {
          "q": "Can SUBSTITUTE remove non-breaking spaces?",
          "a": "Yes, and this is one of its most useful jobs. =TRIM(SUBSTITUTE(A2,CHAR(160),\" \")) handles text pasted from a web page, which TRIM alone cannot clean."
        },
        {
          "q": "Why use it instead of Find and Replace?",
          "a": "Find and Replace is a one-off action on the data itself. SUBSTITUTE is a formula that re-applies every time the source changes, which is what you want for a file you receive monthly."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Changing a separator\n\n<Formula>=SUBSTITUTE(A2, \"/\", \"-\")</Formula>\n\nEvery forward slash becomes a hyphen. With no fourth argument, all occurrences are replaced.\n\n### 2. Deleting rather than replacing\n\n<Formula>=SUBSTITUTE(A2, \"REF/\", \"\")</Formula>\n\nAn empty string as the replacement removes the text entirely. This is the standard way to strip a prefix, a currency symbol, or stray punctuation.\n\n### 3. One occurrence only\n\n<Formula>=SUBSTITUTE(A2, \"/\", \"-\", 2)</Formula>\n\nThe fourth argument picks which occurrence. Here only the second slash changes, leaving the first alone — useful when a code has a structure you want to keep partly intact.\n\n<Callout type=\"tip\" title=\"The cleaning combination\">\n=TRIM(SUBSTITUTE(A2, CHAR(160), \" \")) is worth memorising. It converts non-breaking spaces to ordinary ones and then removes them. Between them these two functions fix the large majority of failed lookups on imported text.\n</Callout>\n"
  },
  {
    "slug": "sumifs",
    "data": {
      "slug": "sumifs",
      "name": "SUMIFS",
      "category": "Math",
      "summary": "Add values meeting several conditions",
      "description": "SUMIFS adds up the numbers in a range, but only for rows that meet every condition you set. It handles multiple criteria at once, which is what separates it from SUMIF, and it is the function most business reporting actually runs on.",
      "versions": [
        "Excel 2007 and later"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 6,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/cash-flow-forecast.xlsx",
      "related": [
        "SUMIF",
        "COUNTIFS",
        "XLOOKUP",
        "SUMPRODUCT"
      ],
      "syntax": "=SUMIFS(sum_range, criteria_range1, criteria1, [criteria_range2, criteria2], ...)",
      "arguments": [
        {
          "name": "sum_range",
          "required": true,
          "description": "The numbers to add up. This comes first, unlike SUMIF where it comes last."
        },
        {
          "name": "criteria_range1",
          "required": true,
          "description": "The range to test. Must be the same size as sum_range."
        },
        {
          "name": "criteria1",
          "required": true,
          "description": "What to test for. A value, a cell reference, or a comparison in quotes such as \">1000\"."
        },
        {
          "name": "criteria_range2, criteria2",
          "required": false,
          "description": "Further pairs, up to 127 of them. Every condition must be true for a row to be included."
        }
      ],
      "demo": {
        "file": "Q3 regional sales.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Order",
          "Region",
          "Status",
          "Amount"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "rows": [
          [
            "#1041",
            "North",
            "Closed",
            12400
          ],
          [
            "#1042",
            "South",
            "Open",
            8100
          ],
          [
            "#1043",
            "North",
            "Open",
            9600
          ],
          [
            "#1044",
            "North",
            "Closed",
            15250
          ],
          [
            "#1045",
            "East",
            "Closed",
            7300
          ],
          [
            "#1046",
            "North",
            "Closed",
            4880
          ]
        ],
        "presets": [
          {
            "label": "One condition",
            "formula": "=SUMIFS(D2:D7, B2:B7, \"North\")"
          },
          {
            "label": "Two conditions",
            "formula": "=SUMIFS(D2:D7, B2:B7, \"North\", C2:C7, \"Closed\")"
          },
          {
            "label": "Greater than",
            "formula": "=SUMIFS(D2:D7, D2:D7, \">10000\")"
          },
          {
            "label": "Everything closed",
            "formula": "=SUMIFS(D2:D7, C2:C7, \"Closed\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "sum_range and criteria_range are different sizes",
          "body": "This returns"
        },
        {
          "level": "error",
          "title": "Putting sum_range last, as in SUMIF",
          "body": "SUMIF is =SUMIF(range, criteria, sum_range). SUMIFS is =SUMIFS(sum_range, range, criteria). The order is reversed and there is no warning — you simply get the wrong number, or a total of zero."
        },
        {
          "level": "warning",
          "title": "Comparison operators need quotes",
          "body": "Write \">1000\" not >1000. Without quotes Excel treats it as a broken formula. To compare against a cell, join the operator to the reference — \">\"&F1 — rather than writing \">F1\"."
        },
        {
          "level": "warning",
          "title": "Text criteria that look identical but are not",
          "body": "A trailing space, a non-breaking space pasted from a web page, or a number stored as text will all fail to match silently. The total comes back lower than it should and nothing flags it. Check with COUNTIFS first — if the count is zero, the criteria are wrong, not the data."
        }
      ],
      "faq": [
        {
          "q": "What is the difference between SUMIF and SUMIFS?",
          "a": "SUMIF handles one condition, SUMIFS handles up to 127. They also take their arguments in opposite orders, which causes more errors than the feature difference does. Use SUMIFS for everything and you never have to remember which is which."
        },
        {
          "q": "Can SUMIFS use OR logic instead of AND?",
          "a": "Not directly. Every criteria pair must be true for a row to count, which is AND logic. For OR, add two SUMIFS together, or use SUMPRODUCT with an addition inside it."
        },
        {
          "q": "How do I sum between two dates?",
          "a": "Use two criteria on the same range. For example =SUMIFS(D2:D7, A2:A7, \">=\"&DATE(2026,1,1), A2:A7, \"<=\"&DATE(2026,3,31)). Both conditions apply to the date column."
        },
        {
          "q": "Why does my SUMIFS return zero?",
          "a": "Almost always the criteria never match. Test with COUNTIFS using the same criteria — if that returns zero too, the problem is the criteria or the data formatting, not the sum. Numbers stored as text are the usual culprit."
        },
        {
          "q": "Can I use wildcards in the criteria?",
          "a": "Yes. An asterisk matches any number of characters and a question mark matches one. \"North*\" matches North and Northern. This only works on text, not numbers."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Total by region\n\nThe simplest use. One criteria pair, testing the region column.\n\n<Formula>=SUMIFS(D2:D7, B2:B7, \"North\")</Formula>\n\nRead it as: add the amounts, where the region is North. The sum range comes first, then each range-and-condition pair follows.\n\n### 2. Two conditions at once\n\nThis is why SUMIFS exists. Add another pair and both must be satisfied.\n\n<Formula>=SUMIFS(D2:D7, B2:B7, \"North\", C2:C7, \"Closed\")</Formula>\n\nOnly rows that are both in the North region and marked Closed are included. Every additional pair narrows the result further.\n\n<Callout type=\"tip\" title=\"Worth knowing\">\nCriteria pairs are AND logic, never OR. If you need North or South, add two SUMIFS together rather than looking for an OR option that does not exist.\n</Callout>\n\n### 3. Comparisons rather than exact matches\n\nCriteria can test a value rather than match one. The operator goes inside the quotes.\n\n<Formula>=SUMIFS(D2:D7, D2:D7, \">10000\")</Formula>\n\nNote that the sum range and criteria range are the same here. That is allowed and often useful — this adds up only the large orders.\n\nTo compare against a cell rather than a typed number, join them: `\">\"&F1`. Writing `\">F1\"` looks for the literal text F1 and returns zero.\n"
  },
  {
    "slug": "sumproduct",
    "data": {
      "slug": "sumproduct",
      "name": "SUMPRODUCT",
      "category": "Math",
      "summary": "Multiply then add across arrays",
      "description": "SUMPRODUCT multiplies ranges together element by element and adds the results. That description undersells it — because it handles arrays natively, it does weighted averages, conditional counts and multi-criteria work that predates SUMIFS entirely.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 6,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/inventory-tracker.xlsx",
      "related": [
        "SUMIFS",
        "COUNTIFS",
        "SUM",
        "ROUND"
      ],
      "syntax": "=SUMPRODUCT(array1, [array2], ...)",
      "arguments": [
        {
          "name": "array1",
          "required": true,
          "description": "The first range. With only one argument, SUMPRODUCT behaves like SUM."
        },
        {
          "name": "array2",
          "required": false,
          "description": "Further ranges, multiplied element by element. All must be the same size or you get"
        }
      ],
      "demo": {
        "file": "Order lines.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Product",
          "Quantity",
          "Unit price",
          "Region"
        ],
        "editable": [
          1,
          2
        ],
        "money": [
          2
        ],
        "rows": [
          [
            "Widget",
            12,
            24.5,
            "North"
          ],
          [
            "Bracket",
            40,
            8.75,
            "South"
          ],
          [
            "Cable",
            25,
            15.2,
            "North"
          ],
          [
            "Housing",
            6,
            47,
            "East"
          ],
          [
            "Sensor",
            3,
            112.4,
            "North"
          ],
          [
            "Adapter",
            18,
            19.9,
            "West"
          ]
        ],
        "presets": [
          {
            "label": "Order value",
            "formula": "=SUMPRODUCT(B2:B7, C2:C7)"
          },
          {
            "label": "Total quantity",
            "formula": "=SUMPRODUCT(B2:B7)"
          },
          {
            "label": "Weighted average price",
            "formula": "=ROUND(SUMPRODUCT(B2:B7, C2:C7) / SUM(B2:B7), 2)"
          },
          {
            "label": "Compare with SUMIFS",
            "formula": "=SUMIFS(B2:B7, D2:D7, \"North\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Ranges of different sizes",
          "body": "Every array must have identical dimensions. B2:B7 with C2:C8 returns"
        },
        {
          "level": "warning",
          "title": "Text in the range becomes zero",
          "body": "SUMPRODUCT treats text as zero rather than erroring. A column with \"n/a\" typed into it quietly reduces the total. The result looks plausible, which is what makes it dangerous."
        },
        {
          "level": "warning",
          "title": "Reaching for it when SUMIFS would do",
          "body": "Since Excel 2007, SUMIFS handles most conditional work more legibly. SUMPRODUCT earns its place for weighted averages, OR logic across criteria, and anything genuinely array-shaped. Otherwise SUMIFS is easier for the next person to read."
        },
        {
          "level": "warning",
          "title": "Slow on very large ranges",
          "body": "SUMPRODUCT evaluates every element of every array. Pointed at whole columns across thousands of rows and repeated hundreds of times, it becomes noticeably slow. Limit the ranges to the rows that actually contain data."
        }
      ],
      "faq": [
        {
          "q": "What does SUMPRODUCT actually do?",
          "a": "It lines the arrays up, multiplies each set of matching positions, then adds all those products. With one array it is just SUM. With two it is the classic quantity times price total."
        },
        {
          "q": "When should I use it instead of SUMIFS?",
          "a": "For weighted averages, for OR logic across criteria, and where the calculation is genuinely array-shaped. For straightforward conditional sums, SUMIFS is clearer."
        },
        {
          "q": "How does SUMPRODUCT do conditional sums?",
          "a": "A comparison like (D2:D7=\"North\") produces TRUE and FALSE values. Multiplying by them turns TRUE into 1 and FALSE into 0, so non-matching rows contribute nothing. This is how conditional totals were built before SUMIFS existed."
        },
        {
          "q": "Why is it in modern spreadsheets at all?",
          "a": "Weighted averages, mainly. There is no WEIGHTEDAVERAGE function, and =SUMPRODUCT(weights,values)/SUM(weights) remains the standard way to do it."
        },
        {
          "q": "Does it need Ctrl+Shift+Enter?",
          "a": "No. SUMPRODUCT handles arrays natively, which was its original advantage over array formulas and is why it survived into modern Excel."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Quantity times price\n\nThe classic use, and the one worth knowing.\n\n<Formula>=SUMPRODUCT(B2:B7, C2:C7)</Formula>\n\nEach quantity is multiplied by its own unit price and the results are added. Without SUMPRODUCT you would need a helper column of line totals and then a SUM.\n\n### 2. A weighted average\n\nThere is no built-in function for this, so SUMPRODUCT is the standard answer.\n\n<Formula>=ROUND(SUMPRODUCT(B2:B7, C2:C7) / SUM(B2:B7), 2)</Formula>\n\nTotal value divided by total quantity gives the average price weighted by how much of each product was sold. A plain AVERAGE of the price column would treat a three-unit line the same as a forty-unit line, and give a materially different answer.\n\n### 3. With a single array\n\n<Formula>=SUMPRODUCT(B2:B7)</Formula>\n\nOne argument and it is simply SUM. Not useful in itself, but it shows what the function is doing underneath.\n\n<Callout type=\"tip\" title=\"How the conditional version works\">\nWriting =SUMPRODUCT((D2:D7=\"North\")*B2:B7) sums quantities for the North region only. The comparison produces TRUE and FALSE, multiplication converts those to 1 and 0, and non-matching rows contribute nothing. This is how everyone did conditional sums before SUMIFS arrived in 2007, and it still works in every version.\n</Callout>\n"
  },
  {
    "slug": "textjoin",
    "data": {
      "slug": "textjoin",
      "name": "TEXTJOIN",
      "category": "Text",
      "summary": "Join text with a delimiter",
      "description": "TEXTJOIN combines text from several cells into one, separated by whatever character you choose, and can skip the empty ones. It replaces the long chains of ampersands that used to be needed for the same job.",
      "versions": [
        "Excel 2019 and later"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/invoice-register.xlsx",
      "related": [
        "CONCAT",
        "TRIM",
        "SUBSTITUTE",
        "LEFT"
      ],
      "syntax": "=TEXTJOIN(delimiter, ignore_empty, text1, [text2], ...)",
      "arguments": [
        {
          "name": "delimiter",
          "required": true,
          "description": "What to put between each item. A comma and space \", \" is common. Use \"\" for nothing."
        },
        {
          "name": "ignore_empty",
          "required": true,
          "description": "TRUE skips blank cells. FALSE includes them, producing consecutive delimiters. TRUE is almost always what you want."
        },
        {
          "name": "text1, text2",
          "required": true,
          "description": "The cells, ranges or literal text to join. A range counts as one argument."
        }
      ],
      "demo": {
        "file": "Contact list.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "First name",
          "Last name",
          "City",
          "Country"
        ],
        "editable": [],
        "rows": [
          [
            "Ayesha",
            "Khan",
            "Lahore",
            "Pakistan"
          ],
          [
            "James",
            "Brown",
            "Leeds",
            "United Kingdom"
          ],
          [
            "Mei",
            "Chen",
            "Singapore",
            "Singapore"
          ],
          [
            "Sofia",
            "Diaz",
            "Madrid",
            "Spain"
          ],
          [
            "Omar",
            "Farid",
            "Dubai",
            "UAE"
          ],
          [
            "Nina",
            "Petrov",
            "Sofia",
            "Bulgaria"
          ]
        ],
        "presets": [
          {
            "label": "Join a column",
            "formula": "=TEXTJOIN(\", \", TRUE, C2:C7)"
          },
          {
            "label": "Build a full name",
            "formula": "=TEXTJOIN(\" \", TRUE, A2, B2)"
          },
          {
            "label": "Address line",
            "formula": "=TEXTJOIN(\", \", TRUE, A3, B3, C3, D3)"
          },
          {
            "label": "Different delimiter",
            "formula": "=TEXTJOIN(\" | \", TRUE, D2:D7)"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Not available in Excel 2016 or earlier",
          "body": "TEXTJOIN arrived in Excel 2019. Open the file in 2016 and every TEXTJOIN becomes"
        },
        {
          "level": "warning",
          "title": "Setting ignore_empty to FALSE",
          "body": "With FALSE, blank cells still produce a delimiter, so you get \"North,,South\" with a gap in the middle. This is occasionally deliberate for fixed-width output, but it is usually a mistake."
        },
        {
          "level": "warning",
          "title": "The 32767 character limit",
          "body": "The result cannot exceed a cell's capacity. Joining a very long column returns"
        },
        {
          "level": "warning",
          "title": "Numbers lose their formatting",
          "body": "A cell displaying £1,234.00 joins as 1234. Formatting is display only. Wrap the value in TEXT with an explicit format if the appearance matters."
        }
      ],
      "faq": [
        {
          "q": "What is the difference between TEXTJOIN and CONCAT?",
          "a": "CONCAT joins with nothing between and cannot skip blanks. TEXTJOIN adds a delimiter and can ignore empty cells. For anything list-shaped, TEXTJOIN is the better tool."
        },
        {
          "q": "Can TEXTJOIN use a line break as the delimiter?",
          "a": "Yes, with CHAR(10). You then need to turn on Wrap Text for the cell, otherwise the line breaks are there but invisible."
        },
        {
          "q": "How do I join only the rows that meet a condition?",
          "a": "Wrap the range in an IF and enter it as an array formula, or use FILTER inside TEXTJOIN in Excel 365. In older versions this is genuinely awkward and a helper column is usually cleaner."
        },
        {
          "q": "Does TEXTJOIN work on numbers?",
          "a": "Yes, but they are converted to plain text and lose any number formatting. Use TEXT to control how they appear."
        },
        {
          "q": "What can I use in Excel 2016?",
          "a": "Chain with ampersands — =A2&\" \"&B2 — or use CONCATENATE. Neither can skip blanks, so you may need IF wrappers to avoid stray delimiters."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Joining a whole column\n\n<Formula>=TEXTJOIN(\", \", TRUE, C2:C7)</Formula>\n\nOne argument covers the entire range. Every city appears in a single cell, comma separated. This is the use that makes TEXTJOIN worth learning.\n\n### 2. Building a name from parts\n\n<Formula>=TEXTJOIN(\" \", TRUE, A2, B2)</Formula>\n\nWith TRUE as the second argument, a missing middle name produces no double space. That is the behaviour the old ampersand approach could not manage without extra IF logic.\n\n### 3. Assembling an address\n\n<Formula>=TEXTJOIN(\", \", TRUE, A3, B3, C3, D3)</Formula>\n\nIndividual cells rather than a range. Any that are blank are skipped, so the punctuation stays correct however complete the record is.\n\n<Callout type=\"tip\" title=\"Worth knowing\">\nThe delimiter can be more than one character. \" | \" reads well in exported data, and CHAR(10) gives a line break inside the cell — useful for turning a column of items into a readable block, provided Wrap Text is enabled.\n</Callout>\n"
  },
  {
    "slug": "trim",
    "data": {
      "slug": "trim",
      "name": "TRIM",
      "category": "Text",
      "summary": "Strip extra spaces",
      "description": "TRIM removes leading and trailing spaces and reduces runs of spaces inside text to one. It is the first thing to try when a lookup fails on data that looks perfectly correct.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 4,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/kpi-dashboard.xlsx",
      "related": [
        "SUBSTITUTE",
        "LEN",
        "XLOOKUP",
        "IFERROR"
      ],
      "syntax": "=TRIM(text)",
      "arguments": [
        {
          "name": "text",
          "required": true,
          "description": "The text to clean. A cell reference, or text in quotes."
        }
      ],
      "demo": {
        "file": "Imported customers.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Customer",
          "Region",
          "Contact",
          "Value"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "rows": [
          [
            "  Northgate Ltd",
            "North",
            "A Khan",
            24500
          ],
          [
            "Bridgeway  ",
            "South",
            "J Brown",
            18750
          ],
          [
            "Castleton   Group",
            "North",
            "M Chen",
            32100
          ],
          [
            "Dunmore",
            "East",
            "S Diaz",
            9400
          ],
          [
            "  Eastvale  ",
            "West",
            "O Farid",
            15600
          ],
          [
            "Fairholm",
            "North",
            "N Petrov",
            21300
          ]
        ],
        "presets": [
          {
            "label": "Leading spaces",
            "formula": "=TRIM(A2)"
          },
          {
            "label": "Trailing spaces",
            "formula": "=TRIM(A3)"
          },
          {
            "label": "Spaces in the middle",
            "formula": "=TRIM(A4)"
          },
          {
            "label": "Length before and after",
            "formula": "=LEN(A6)-LEN(TRIM(A6))"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "It does not remove every kind of space",
          "body": "TRIM only handles the ordinary space, character 32. Text copied from a web page often contains a non-breaking space, character 160, which TRIM ignores completely. Use SUBSTITUTE(A2,CHAR(160),\"\") first, then TRIM."
        },
        {
          "level": "warning",
          "title": "Trimming does not change the original",
          "body": "TRIM returns a cleaned copy in a new cell. The source is untouched. To clean data in place, copy the trimmed column and paste as values over the original."
        },
        {
          "level": "warning",
          "title": "It also collapses internal spaces",
          "body": "Two spaces between words become one. That is usually desirable but not always — in a fixed-width identifier or a code with deliberate spacing, TRIM changes the value."
        },
        {
          "level": "warning",
          "title": "Numbers stored as text stay text",
          "body": "TRIM cleans the spaces but the result is still text. If you trimmed a number to make it match, wrap it in VALUE as well, otherwise the lookup still fails."
        }
      ],
      "faq": [
        {
          "q": "Why does my lookup fail on data that looks identical?",
          "a": "Almost always a trailing space. It is invisible on screen and makes two apparently identical values different. Compare =LEN(A2) against =LEN(TRIM(A2)) — if they differ, that is your answer."
        },
        {
          "q": "How do I remove non-breaking spaces?",
          "a": "Use =TRIM(SUBSTITUTE(A2,CHAR(160),\" \")). The SUBSTITUTE converts them to ordinary spaces first, then TRIM removes them. This combination handles almost all pasted-from-the-web text."
        },
        {
          "q": "Can TRIM clean a whole column at once?",
          "a": "Write it in a helper column, fill down, then copy and paste as values over the original. Power Query is better for anything you have to repeat every month."
        },
        {
          "q": "Does TRIM remove line breaks?",
          "a": "No. Line breaks are character 10, not spaces. Use =CLEAN(A2) for those, or SUBSTITUTE with CHAR(10)."
        },
        {
          "q": "Should I trim data on the way in?",
          "a": "Yes, if you receive the same export regularly. Cleaning at the point of import means every downstream formula can assume clean data, which is far less fragile than trimming defensively everywhere."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Leading and trailing spaces\n\n<Formula>=TRIM(A2)</Formula>\n\nThe customer name has two leading spaces that are impossible to see. TRIM removes them and returns the clean name.\n\n### 2. Runs of spaces inside the text\n\n<Formula>=TRIM(A4)</Formula>\n\nCastleton has three spaces between the words. TRIM reduces them to one, which is usually what you want — though be careful with codes where spacing is meaningful.\n\n### 3. Proving there is a problem\n\n<Formula>=LEN(A6)-LEN(TRIM(A6))</Formula>\n\nThis is the diagnostic worth knowing. It returns how many characters TRIM would remove. A non-zero answer explains a failing lookup in one step, without you having to see anything.\n\n<Callout type=\"warning\" title=\"The space TRIM cannot see\">\nData pasted from a web page frequently contains character 160, a non-breaking space. It looks exactly like a normal space and TRIM ignores it entirely. When TRIM appears to do nothing on obviously spaced text, this is why. Use =TRIM(SUBSTITUTE(A2,CHAR(160),\" \")) instead.\n</Callout>\n"
  },
  {
    "slug": "unique",
    "data": {
      "slug": "unique",
      "name": "UNIQUE",
      "category": "Dynamic array",
      "summary": "Return the distinct values in a list",
      "description": "UNIQUE strips duplicates from a range and returns what is left, spilling the results down the sheet. It replaces the Remove Duplicates command for anything that needs to stay live as the data changes.",
      "versions": [
        "Excel 365",
        "Excel 2021"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 5,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/kpi-dashboard.xlsx",
      "related": [
        "FILTER",
        "SORT",
        "COUNTIFS",
        "SUMIFS"
      ],
      "syntax": "=UNIQUE(array, [by_col], [exactly_once])",
      "arguments": [
        {
          "name": "array",
          "required": true,
          "description": "The range to de-duplicate."
        },
        {
          "name": "by_col",
          "required": false,
          "description": "FALSE or omitted compares rows. TRUE compares columns. Rows is nearly always what you want."
        },
        {
          "name": "exactly_once",
          "required": false,
          "description": "TRUE returns only values appearing exactly once, discarding anything repeated. FALSE or omitted returns one of each."
        }
      ],
      "demo": {
        "file": "Q3 regional sales.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "Order",
          "Region",
          "Status",
          "Amount"
        ],
        "editable": [
          3
        ],
        "money": [
          3
        ],
        "rows": [
          [
            "#1041",
            "North",
            "Closed",
            12400
          ],
          [
            "#1042",
            "South",
            "Open",
            8100
          ],
          [
            "#1043",
            "North",
            "Open",
            9600
          ],
          [
            "#1044",
            "North",
            "Closed",
            15250
          ],
          [
            "#1045",
            "East",
            "Closed",
            7300
          ],
          [
            "#1046",
            "North",
            "Closed",
            4880
          ]
        ],
        "presets": [
          {
            "label": "How many are North",
            "formula": "=COUNTIFS(B2:B7, \"North\")"
          },
          {
            "label": "How many are South",
            "formula": "=COUNTIFS(B2:B7, \"South\")"
          },
          {
            "label": "Distinct count",
            "formula": "=SUMPRODUCT(1/COUNTIFS(B2:B7, B2:B7))"
          },
          {
            "label": "Appears exactly once",
            "formula": "=COUNTIFS(B2:B7, \"East\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Not available before Excel 2021",
          "body": "UNIQUE returns"
        },
        {
          "level": "error",
          "title": "The spill range is blocked",
          "body": "UNIQUE needs empty cells beneath it. Anything in the way returns"
        },
        {
          "level": "warning",
          "title": "Trailing spaces create false duplicates",
          "body": "A value of North and one with a trailing space are different values, so both appear in the result. This is the most common reason a unique list comes back longer than expected. Wrap the range in TRIM to be sure."
        },
        {
          "level": "warning",
          "title": "exactly_once means something different from unique",
          "body": "With the third argument TRUE, values that appear more than once are excluded entirely rather than reduced to one. That is a different question — which values are singletons — and mixing the two up silently drops data."
        }
      ],
      "faq": [
        {
          "q": "Why does the demo use COUNTIFS rather than UNIQUE?",
          "a": "The interactive grid evaluates one formula into one cell, and UNIQUE spills a list across many. The presets show the related counts. The distinct-count preset uses the SUMPRODUCT idiom that works in every version."
        },
        {
          "q": "How do I count distinct values without UNIQUE?",
          "a": "Use =SUMPRODUCT(1/COUNTIFS(range,range)). Each value contributes one divided by how many times it appears, so a value appearing three times contributes a third, three times over. It fails if the range contains blanks."
        },
        {
          "q": "Can UNIQUE work across several columns?",
          "a": "Yes. Give it a multi-column range and it returns distinct combinations of the whole row, which is how you build a unique customer and product list in one step."
        },
        {
          "q": "How do I sort the result?",
          "a": "Wrap it — =SORT(UNIQUE(B2:B7)). Dynamic array functions nest freely, and this pairing is common enough to be worth remembering."
        },
        {
          "q": "Does UNIQUE ignore case?",
          "a": "Yes. \"north\" and \"North\" are treated as the same value and only one is returned. Which one depends on which appears first."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. The distinct list\n\nIn Excel, `=UNIQUE(B2:B7)` returns North, South and East — one of each, in the order they first appear. The interactive grid above cannot show a spilled list, so the presets demonstrate the counts behind it.\n\n<Formula>=COUNTIFS(B2:B7, \"North\")</Formula>\n\n### 2. Counting distinct values without UNIQUE\n\nThis idiom works in every version of Excel and is worth knowing even if you have UNIQUE available.\n\n<Formula>=SUMPRODUCT(1/COUNTIFS(B2:B7, B2:B7))</Formula>\n\nEach row contributes one divided by the number of times its value appears. North appears four times, so each of those four rows contributes a quarter, totalling one. Add up all the contributions and you get the number of distinct values.\n\n<Callout type=\"warning\" title=\"It breaks on blanks\">\nIf any cell in the range is empty, COUNTIFS returns zero for it and the formula divides by zero. Restrict the range to rows that actually contain data, or use UNIQUE if your version has it.\n</Callout>\n\n### 3. Combining with SORT\n\n`=SORT(UNIQUE(B2:B7))` gives an alphabetical list of distinct regions that updates itself as data is added. Building the same thing with Remove Duplicates means redoing it by hand every time the data changes.\n"
  },
  {
    "slug": "vlookup",
    "data": {
      "slug": "vlookup",
      "name": "VLOOKUP",
      "category": "Lookup",
      "summary": "Look up a value in the first column",
      "description": "VLOOKUP searches the first column of a range for a value and returns something from a column to its right. It is the most widely known Excel function and, in modern Excel, the one you should usually replace with XLOOKUP or INDEX/MATCH.",
      "versions": [
        "All versions"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 7,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/inventory-tracker.xlsx",
      "related": [
        "XLOOKUP",
        "INDEX",
        "MATCH",
        "IFERROR"
      ],
      "syntax": "=VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])",
      "arguments": [
        {
          "name": "lookup_value",
          "required": true,
          "description": "The value to search for. It must be in the first column of table_array."
        },
        {
          "name": "table_array",
          "required": true,
          "description": "The whole block of data, starting with the column being searched."
        },
        {
          "name": "col_index_num",
          "required": true,
          "description": "Which column of that block to return, counted from the left. Column 1 is the lookup column itself."
        },
        {
          "name": "range_lookup",
          "required": false,
          "description": "FALSE for an exact match. TRUE or omitted gives an approximate match and requires sorted data. Always write FALSE unless you specifically want banding."
        }
      ],
      "demo": {
        "file": "Product catalogue.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "SKU",
          "Product",
          "Price",
          "Stock"
        ],
        "editable": [
          2,
          3
        ],
        "money": [
          2
        ],
        "rows": [
          [
            "SKU-101",
            "Widget",
            24.5,
            140
          ],
          [
            "SKU-108",
            "Bracket",
            8.75,
            62
          ],
          [
            "SKU-114",
            "Cable",
            15.2,
            25
          ],
          [
            "SKU-122",
            "Housing",
            47,
            8
          ],
          [
            "SKU-130",
            "Sensor",
            112.4,
            31
          ],
          [
            "SKU-145",
            "Adapter",
            19.9,
            54
          ]
        ],
        "presets": [
          {
            "label": "Return the price",
            "formula": "=VLOOKUP(\"SKU-114\", A2:D7, 3, FALSE)"
          },
          {
            "label": "Return the stock",
            "formula": "=VLOOKUP(\"SKU-114\", A2:D7, 4, FALSE)"
          },
          {
            "label": "Missing value",
            "formula": "=VLOOKUP(\"SKU-999\", A2:D7, 3, FALSE)"
          },
          {
            "label": "Wrapped in IFERROR",
            "formula": "=IFERROR(VLOOKUP(\"SKU-999\", A2:D7, 3, FALSE), \"Not in catalogue\")"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "Forgetting FALSE on the last argument",
          "body": "Leave range_lookup off and Excel does an approximate match on unsorted data. It does not error. It returns a plausible but wrong value, which is far more dangerous than a visible failure. Write FALSE every time."
        },
        {
          "level": "error",
          "title": "The column index breaks when someone inserts a column",
          "body": "VLOOKUP counts columns by position, not by name. Insert a column inside the table and every formula pointing past it now returns the wrong field, silently. This single weakness is the main reason XLOOKUP exists."
        },
        {
          "level": "error",
          "title": "The lookup value is not in the first column",
          "body": "VLOOKUP can only search the leftmost column of the range you give it. To look left, you need INDEX and MATCH, or XLOOKUP. There is no argument that changes this."
        },
        {
          "level": "warning",
          "title": "Numbers stored as text",
          "body": "A SKU typed as 114 and one stored as text \"114\" are different values and will not match, giving"
        }
      ],
      "faq": [
        {
          "q": "Should I still use VLOOKUP?",
          "a": "If your file might be opened in Excel 2019 or earlier, yes — XLOOKUP does not exist there and returns"
        },
        {
          "q": "Why does VLOOKUP return",
          "a": "Nothing matched. The usual causes are a trailing space, numbers stored as text, a spelling difference, or a lookup value that is not in the first column of the range. Wrap it in IFERROR only after you have checked which of these it is."
        },
        {
          "q": "How do I make VLOOKUP look to the left?",
          "a": "You cannot. Use =INDEX(return_range, MATCH(lookup_value, lookup_range, 0)) instead, which works in any direction and in every version of Excel."
        },
        {
          "q": "What does the TRUE option actually do?",
          "a": "It finds the largest value less than or equal to what you searched for, which is useful for tax bands and commission tiers. It requires the first column to be sorted ascending. On unsorted data it returns nonsense without warning."
        },
        {
          "q": "Can VLOOKUP return more than one column?",
          "a": "Not on its own. You would write a separate VLOOKUP for each column, which is slow on large files because each one searches independently. XLOOKUP can return a whole row at once."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Look up a price from a product code\n\nThe standard use. Search the SKU column, return column 3.\n\n<Formula>=VLOOKUP(\"SKU-114\", A2:D7, 3, FALSE)</Formula>\n\nThe range starts at column A because that is where the SKUs are. Column 3 counts from A, so it returns Price. Change the 3 to a 4 and you get Stock.\n\n### 2. Handling a value that is not there\n\nOn its own, a missing value gives #N/A, which looks broken in a report.\n\n<Formula>=IFERROR(VLOOKUP(\"SKU-999\", A2:D7, 3, FALSE), \"Not in catalogue\")</Formula>\n\n<Callout type=\"warning\" title=\"Use IFERROR carefully\">\nIFERROR hides every error, not just #N/A. A #REF! caused by a deleted column would also be swallowed, so a genuinely broken formula would look like a missing value. IFNA catches only the not-found case, which is usually what you actually want.\n</Callout>\n\n### 3. The approximate match, used deliberately\n\nWith TRUE, VLOOKUP finds the largest value at or below your lookup value. This is how commission bands and tax tables are built — but the column being searched must be numeric and sorted ascending.\n\nThe catalogue above is sorted by SKU, which is text, so an approximate match on column A would be meaningless. In a real banding table the first column would hold the lower bound of each band:\n\n<Formula>=VLOOKUP(15.20, C2:C7, 1, FALSE)</Formula>\n\nTwo conditions have to hold for TRUE to be safe: the first column is numeric, and it is sorted ascending. On unsorted data the result is arbitrary, and Excel will not tell you. This is why FALSE should be your default.\n"
  },
  {
    "slug": "xlookup",
    "data": {
      "slug": "xlookup",
      "name": "XLOOKUP",
      "category": "Lookup",
      "summary": "Find a value in any direction",
      "description": "XLOOKUP searches a range for a value and returns a matching result from another range. It replaces VLOOKUP, HLOOKUP and INDEX/MATCH with one function that looks in any direction and doesn't break when you insert a column.",
      "versions": [
        "Excel 365",
        "Excel 2021"
      ],
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 6,
      "video": "https://www.youtube.com/watch?v=PLACEHOLDER",
      "practiceFile": "/downloads/xlookup-practice.xlsx",
      "related": [
        "VLOOKUP",
        "INDEX",
        "MATCH",
        "FILTER"
      ],
      "syntax": "=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])",
      "arguments": [
        {
          "name": "lookup_value",
          "required": true,
          "description": "The value to search for."
        },
        {
          "name": "lookup_array",
          "required": true,
          "description": "The range to search in. A single column or row."
        },
        {
          "name": "return_array",
          "required": true,
          "description": "The range to return from. Must be the same size as lookup_array."
        },
        {
          "name": "if_not_found",
          "required": false,
          "description": "What to return when nothing matches. Without it you get"
        },
        {
          "name": "match_mode",
          "required": false,
          "description": "0 exact (default) · -1 exact or next smaller · 1 exact or next larger · 2 wildcard."
        },
        {
          "name": "search_mode",
          "required": false,
          "description": "1 first to last (default) · -1 last to first · 2 or -2 binary search on sorted data."
        }
      ],
      "demo": {
        "file": "Product lookup.xlsx",
        "columns": [
          "A",
          "B",
          "C",
          "D"
        ],
        "headers": [
          "SKU",
          "Product",
          "Price",
          "Stock"
        ],
        "editable": [
          2,
          3
        ],
        "money": [
          2
        ],
        "rows": [
          [
            "SKU-101",
            "Widget",
            24.5,
            140
          ],
          [
            "SKU-108",
            "Bracket",
            8.75,
            62
          ],
          [
            "SKU-114",
            "Cable",
            15.2,
            25
          ],
          [
            "SKU-122",
            "Housing",
            47,
            8
          ],
          [
            "SKU-130",
            "Sensor",
            112.4,
            31
          ],
          [
            "SKU-145",
            "Adapter",
            19.9,
            54
          ]
        ],
        "presets": [
          {
            "label": "Basic lookup",
            "formula": "=XLOOKUP(\"SKU-114\", A2:A7, C2:C7)"
          },
          {
            "label": "With if_not_found",
            "formula": "=XLOOKUP(\"SKU-999\", A2:A7, C2:C7, \"Not found\")"
          },
          {
            "label": "Approximate match",
            "formula": "=XLOOKUP(28, D2:D7, A2:A7, \"None\", -1)"
          },
          {
            "label": "Look up by name",
            "formula": "=XLOOKUP(\"Cable\", B2:B7, C2:C7)"
          }
        ]
      },
      "mistakes": [
        {
          "level": "error",
          "title": "lookup_array and return_array are different sizes",
          "body": "This returns"
        },
        {
          "level": "error",
          "title": "The lookup value is text but the data is numbers",
          "body": "\"114\" will never match 114. Numbers imported from another system are often stored as text. Check for the green triangle in the corner of the cell, or test with =ISNUMBER(A2)."
        },
        {
          "level": "warning",
          "title": "Trailing spaces",
          "body": "\"North \" and \"North\" are different values. Exported data frequently carries trailing spaces. Wrap the lookup value in TRIM() if you are not sure."
        },
        {
          "level": "warning",
          "title": "Sharing with people on older Excel",
          "body": "XLOOKUP needs Excel 365 or Excel 2021. Open the file in Excel 2019 or earlier and every XLOOKUP becomes"
        }
      ],
      "faq": [
        {
          "q": "Is XLOOKUP better than VLOOKUP?",
          "a": "For most work, yes. It looks left as well as right, defaults to an exact match, has a built-in not-found value, and does not break when columns are inserted. The one reason to keep using VLOOKUP is compatibility — XLOOKUP needs Excel 365 or 2021."
        },
        {
          "q": "Why does my XLOOKUP return",
          "a": "Nothing matched. The usual causes are a trailing space in the data, numbers stored as text, or a spelling difference. Add a fourth argument to return a readable message instead, and check the data with TRIM and ISNUMBER."
        },
        {
          "q": "Can XLOOKUP return more than one column?",
          "a": "Yes. Make return_array span several columns, for example C2:E7, and it spills the whole matching row. This is one thing VLOOKUP cannot do without repeating the formula."
        },
        {
          "q": "Does XLOOKUP work in Excel 2019?",
          "a": "No. It was introduced in Excel 365 and is also in Excel 2021. In Excel 2019 and earlier it returns"
        },
        {
          "q": "Is XLOOKUP slower than VLOOKUP?",
          "a": "On normal-sized data the difference is not noticeable. On very large sorted datasets, setting search_mode to 2 uses a binary search and is considerably faster than either."
        }
      ]
    },
    "body": "\n## Examples\n\n### 1. Find a price from a product code\n\nThe most common use. Search the SKU column, return the matching price.\n\n<Formula>=XLOOKUP(\"SKU-114\", A2:A7, C2:C7)</Formula>\n\nUnlike VLOOKUP, the return column doesn't have to be to the right of the lookup column, and there's no column index number to break when someone inserts a column.\n\n### 2. Return something useful when there's no match\n\nThe fourth argument replaces the whole IFERROR wrapper you used to need.\n\n<Formula>=XLOOKUP(\"SKU-999\", A2:A7, C2:C7, \"Not in catalogue\")</Formula>\n\n<Callout type=\"tip\" title=\"Worth knowing\">\nWith VLOOKUP you'd write `=IFERROR(VLOOKUP(...), \"Not found\")`, which also swallows genuine errors like #REF!. XLOOKUP only catches the not-found case, so real problems still surface.\n</Callout>\n\n### 3. Find the closest match below a value\n\nSet match_mode to -1 for tiered pricing, tax bands, or commission thresholds.\n\n<Formula>=XLOOKUP(28, D2:D7, A2:A7, \"None\", -1)</Formula>\n\nThis finds the largest stock value that is 28 or less, and returns its SKU. Useful whenever you need a band rather than an exact hit.\n"
  }
] as const;

export const GUIDES = [
  {
    "slug": "dashboards",
    "data": {
      "slug": "dashboards",
      "title": "Charts and dashboards people actually read",
      "level": "Intermediate",
      "summary": "Choosing the right chart, and separating your data from your presentation so nothing breaks.",
      "description": "How to build a dashboard that survives being handed over — chart selection, layout, and the one structural decision that determines whether it lasts.",
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 9,
      "related": [
        "SUMIFS",
        "FILTER",
        "UNIQUE",
        "ROUND"
      ]
    },
    "body": "\nMost dashboards fail for one of two reasons. Either they show the wrong thing well, or they show the right thing and break the moment someone else touches them.\n\nBoth are avoidable, and neither is about chart formatting.\n\n## The structural decision\n\nBuild your dashboard in three layers, on separate sheets:\n\n1. **Data** — the raw records, one row each, untouched\n2. **Calculations** — the aggregations that feed the charts\n3. **Presentation** — the charts and the layout\n\nCharts read from layer 2, never from layer 1.\n\nThis sounds like extra work. It is what makes the difference between a dashboard that survives a year and one that breaks the first time the source data changes shape.\n\nA chart built directly on raw transaction data has an implicit dependency on the exact rows and columns being where they were. Add a column, and the chart series points at the wrong field. Nothing errors. The chart just shows something different and looks fine.\n\nA chart built on a small aggregation table has one dependency, in a place you can see.\n\n## Choosing a chart\n\nMost chart choices are decided by what you are comparing:\n\n| What you are showing | Use |\n|---|---|\n| Change over time | Line |\n| Comparison across categories | Bar, horizontal if the labels are long |\n| Part of a whole | Stacked bar, or just a table |\n| Relationship between two measures | Scatter |\n| One number that matters | Large text, not a chart |\n\nThat last row is the one people miss. If the message is \"revenue was £4.2m\", a gauge or a single-value doughnut adds nothing. Large clear type says it better and takes a second to read.\n\n**On pie charts:** they work for two or three slices and become unreadable beyond that, because humans compare angles poorly. A bar chart sorted by size shows the same data more clearly, almost always. Use a pie when the point is genuinely \"this one is about half\" and never for a ranking.\n\n## Sort your bars\n\nAn unsorted bar chart makes the reader do work you could have done for them. Sorting by value turns \"which is biggest\" from a scanning exercise into an instant answer.\n\nThe exception is a natural order — months, or age bands — where reordering would be confusing.\n\n## Start bar charts at zero\n\nA bar chart's message is carried by the relative lengths of the bars. Truncating the axis exaggerates differences, sometimes dramatically. A 3% gap can be made to look like a doubling.\n\nLine charts are different: they show change, and a zero baseline often compresses the shape into a flat line that hides the trend. Truncating a line axis is legitimate, provided the axis is labelled honestly.\n\n## Colour\n\nPick one accent colour and one neutral. Use the accent for the thing you want noticed and the neutral for everything else.\n\nDashboards with eight colours are asking the reader to work out what the colours mean. Dashboards with one accent are telling them where to look.\n\nIf a category has an established meaning — red for over budget, for instance — keep it consistent across every chart on the page. Nothing undermines a report faster than red meaning \"bad\" in one chart and \"region 3\" in the next.\n\n## The aggregation layer\n\nThis is where `SUMIFS` earns its place. A calculation sheet is typically a small grid:\n\n```\n=SUMIFS(Data!$F:$F, Data!$C:$C, $A5, Data!$B:$B, B$4)\n```\n\nRegions down the side, months across the top, one formula filled across and down. Note the dollar signs — locking the column on `$A5` and the row on `B$4` is what lets one formula fill the whole grid.\n\nThat grid is what your chart points at. It is small, it is visible, and if a number looks wrong you can see immediately which cell to check.\n\n## What to leave out\n\n**Every metric you have.** A dashboard is a set of decisions about what matters. Twenty charts is a data dump, and the reader will look at none of them.\n\n**Gauges and speedometers.** They consume a great deal of space to show one number against one target. A number with a small variance figure beside it does the same job in a fraction of the space.\n\n**3D anything.** Perspective distorts the very lengths and angles the chart exists to convey.\n\n## Test it by handing it over\n\nThe real test of a dashboard is not whether it looks good. It is whether someone else can update it next month without asking you how.\n\nIf the answer involves explaining which cells to overwrite and which to leave alone, the structure needs work — not the formatting.\n"
  },
  {
    "slug": "excel-basics",
    "data": {
      "slug": "excel-basics",
      "title": "Excel basics that actually matter",
      "level": "Start here",
      "summary": "The handful of things worth learning first, and the ones you can safely ignore for now.",
      "description": "Cell references, formatting that does not lie to you, and the shortcuts that save real time. Written for someone who uses Excel daily but was never taught it.",
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 9,
      "related": [
        "SUMIFS",
        "IF",
        "ROUND"
      ]
    },
    "body": "\nMost Excel training starts with the ribbon. That is the wrong end. You already know where the buttons are — what you are missing is the small number of concepts that make everything else behave predictably.\n\nThere are four. Learn these and most of your remaining problems become lookups rather than mysteries.\n\n## 1. Absolute and relative references\n\nThis is the single most important thing in the article.\n\nWhen you write `=A2*B2` and drag it down, Excel helpfully changes it to `=A3*B3`, then `=A4*B4`. That is a **relative reference** and it is usually what you want.\n\nNow suppose B1 holds a tax rate and you write `=A2*B1`. Drag it down and the second row becomes `=A3*B2` — which points at an empty cell. Your figures come out wrong and nothing errors.\n\nThe fix is a dollar sign:\n\n```\n=A2*$B$1\n```\n\nThe dollars lock the reference. Dragged down, it stays `$B$1` every time.\n\n**The shortcut worth building into muscle memory:** select a reference in the formula bar and press F4. It cycles through `B1`, `$B$1`, `B$1`, `$B1`. You will use this more than any other keystroke.\n\nThe two middle forms lock only the row or only the column, which matters when you are filling a formula across a grid rather than down a column. Do not worry about those until you need them — but know they exist, because when you do need them nothing else will do.\n\n## 2. Formatting is not the same as value\n\nA cell showing `£1,234.00` might contain 1234, or 1233.9987, or the text \"£1,234.00\".\n\nFormatting changes what you see. It does not change what is stored. This causes two specific problems that account for a large share of the spreadsheet errors I see in audit work.\n\n**Totals that do not agree with the lines above them.** A column formatted to two decimals but holding unrounded values will sum to something other than the sum of the displayed figures. Nobody can find why, because every line looks right. The fix is `ROUND`, which changes the value rather than the display.\n\n**Numbers stored as text.** Imported data frequently arrives as text that looks numeric. It will not sum, and it will not match in a lookup. Test with `=ISNUMBER(A2)`. If a cell that should be a number returns FALSE, that is your problem, and no amount of reformatting will fix it — you have to convert with `VALUE` or Text to Columns.\n\n## 3. One row is one thing\n\nKeep your data as a plain table: one header row, one record per row, no blanks in the middle, no merged cells, no subtotals mixed into the data.\n\nThis feels like a rule about tidiness. It is not. Every tool that makes Excel powerful — PivotTables, `SUMIFS`, `FILTER`, charts, Power Query — assumes this shape. Break it and those tools stop working, usually silently.\n\nThe commonest breach is the helpful subtotal row inserted every so often. It makes the sheet easier to read and every formula below it wrong.\n\nIf you need a readable summary, build it somewhere else and let it reference the clean data. Separating the data layer from the presentation layer is the single habit that most distinguishes a workbook that survives from one that does not.\n\n## 4. Keyboard movement\n\nFour combinations, and you will be noticeably faster:\n\n| Keys | What it does |\n|---|---|\n| `Ctrl` + arrow | Jump to the edge of the data in that direction |\n| `Ctrl` + `Shift` + arrow | Select to that edge |\n| `Ctrl` + `Shift` + `L` | Toggle filters on the current table |\n| `Alt` + `=` | Insert a SUM of the range above |\n\n`Ctrl` + down arrow is also the fastest way to find where your data actually stops, which is often not where you think — a stray space in row 4,000 explains a surprising number of broken ranges.\n\n## What to ignore for now\n\n**Macros and VBA.** Genuinely useful, and almost never the answer to a problem a beginner has. Learn Power Query first; it handles most of what people write macros for, and it does not break when Excel updates.\n\n**Array formulas with Ctrl+Shift+Enter.** Modern Excel handles arrays natively. If a tutorial tells you to press Ctrl+Shift+Enter, it predates 2019 and there is probably a simpler way now.\n\n**Memorising functions.** There are over 450 and you will use about 30. Learn `SUMIFS`, `XLOOKUP` or `INDEX`/`MATCH`, `IF`, `COUNTIFS`, `TRIM` and `ROUND` properly, and look the rest up when you need them.\n\n## The honest summary\n\nYou do not need to learn Excel. You need to learn absolute references, understand that formatting lies, keep your data in a clean table, and know six functions well.\n\nEverything after that is looking things up, which is what the formula library on this site is for.\n"
  },
  {
    "slug": "formulas",
    "data": {
      "slug": "formulas",
      "title": "Formulas that do the work for you",
      "level": "Beginner",
      "summary": "Moving from typing numbers to writing logic, and the patterns that cover most business problems.",
      "description": "The handful of formula patterns that solve the majority of real spreadsheet tasks, with the reasoning behind why each one is shaped the way it is.",
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 10,
      "related": [
        "SUMIFS",
        "XLOOKUP",
        "IF",
        "COUNTIFS",
        "IFERROR"
      ]
    },
    "body": "\nMost people learn formulas one at a time, as answers to specific questions. That works, but it is slow, and it leaves you unable to solve anything you have not seen before.\n\nThere is a better route. Almost every business calculation is one of five shapes. Learn the shapes and the individual functions become details.\n\n## Shape 1: add up the ones that match\n\nYou have a list of transactions and you want a total for one category, one region, one month.\n\n```\n=SUMIFS(D2:D500, B2:B500, \"North\", C2:C500, \"Closed\")\n```\n\nSum range first, then pairs of range-and-condition. Every pair narrows the result further.\n\nThis one formula replaces filtering, copying to another sheet, and summing there — and unlike that process, it updates itself when the data changes.\n\n**The diagnostic that saves you time:** if `SUMIFS` returns zero and you cannot see why, run `COUNTIFS` with the same conditions. Zero count means the conditions never match, which points at the data rather than the sum. It is one step and it eliminates half the possible causes.\n\n## Shape 2: fetch a matching value\n\nYou have a code and you need the thing that goes with it.\n\n```\n=XLOOKUP(A2, Products!A:A, Products!C:C, \"Not found\")\n```\n\nOr, for files that might open in older Excel:\n\n```\n=INDEX(Products!C:C, MATCH(A2, Products!A:A, 0))\n```\n\nBoth do the same job. `XLOOKUP` is clearer; `INDEX`/`MATCH` works everywhere and does not break when someone inserts a column.\n\n`VLOOKUP` also does this, and I would not start with it. It cannot look left, and its column index breaks silently whenever the table structure changes.\n\n## Shape 3: decide between outcomes\n\n```\n=IF(C2 > D2, \"OK\", \"Reorder\")\n```\n\nTwo outcomes. For more, use `IFS` rather than nesting:\n\n```\n=IFS(C2=0, \"Out of stock\", C2<=D2, \"Reorder\", TRUE, \"OK\")\n```\n\nThe `TRUE` at the end is the catch-all. Without it, anything matching no condition returns `#N/A`.\n\n**Order matters more than people expect.** The first true condition wins and the rest are never checked. Test from most specific to least, or your careful logic gets short-circuited by a broad condition sitting too early.\n\n## Shape 4: clean before you calculate\n\nFormulas fail on messy data far more often than they fail on flawed logic.\n\n```\n=TRIM(A2)\n=VALUE(B2)\n=TRIM(SUBSTITUTE(A2, CHAR(160), \" \"))\n```\n\nThat third one deserves attention. Text pasted from a web page frequently contains character 160, a non-breaking space. It looks exactly like a normal space and `TRIM` ignores it completely. The `SUBSTITUTE` converts it first.\n\nWhen a lookup fails on data that looks identical, this is the reason more often than anything else.\n\n## Shape 5: handle the failure case\n\n```\n=IFNA(XLOOKUP(A2, Ref!A:A, Ref!B:B), \"Not in reference\")\n```\n\nNote `IFNA` rather than `IFERROR`. `IFNA` catches only the not-found case. `IFERROR` catches everything, including a `#REF!` from a deleted column — so a genuinely broken formula returns your friendly message and looks fine.\n\nThat distinction matters six months later when someone restructures the source sheet. With `IFNA` you get a visible error. With `IFERROR` you get quiet wrong numbers.\n\n## Putting the shapes together\n\nReal formulas combine them:\n\n```\n=IFNA(INDEX(Prices!C:C, MATCH(TRIM(A2), Prices!A:A, 0)), 0)\n```\n\nReading outward from the middle: trim the lookup value, find its position, return the matching price, and if it is not there return zero.\n\nWritten as one line it looks intimidating. Built up shape by shape, it is four steps you already know.\n\n## How to debug one\n\nWhen a long formula misbehaves, take it apart. Put the innermost piece in its own cell and check what it returns. Then the next layer out.\n\nNine times in ten the problem is at the bottom — a `MATCH` returning `#N/A` because of a trailing space, or a `VALUE` failing on text with a currency symbol still attached. Finding it takes two minutes if you split the formula and twenty if you stare at the whole thing.\n\n## What to learn next\n\n`SUMIFS`, `XLOOKUP` or `INDEX`/`MATCH`, `IF`, `COUNTIFS`, `TRIM` and `IFNA` will carry you through most of what a finance or operations role demands.\n\nAfter those, the useful additions are `SUMPRODUCT` for weighted averages, `EOMONTH` for period ends, and `TEXTJOIN` for assembling text. Each has a page in the library with a live example you can edit.\n"
  },
  {
    "slug": "interview-prep",
    "data": {
      "slug": "interview-prep",
      "title": "Excel questions employers actually ask",
      "level": "All levels",
      "summary": "The questions that come up in finance, audit and analyst interviews, with answers that show judgement rather than recall.",
      "description": "Real Excel interview questions for finance and analyst roles, what the interviewer is testing, and how to answer in a way that demonstrates you have used a spreadsheet in anger.",
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 10,
      "related": [
        "XLOOKUP",
        "SUMIFS",
        "INDEX",
        "IFERROR"
      ]
    },
    "body": "\nExcel questions in an interview are rarely testing whether you know a function. They are testing whether you have used a spreadsheet somebody else depended on.\n\nThe difference shows in the answers. Someone who has only studied Excel names the function. Someone who has used it mentions what goes wrong.\n\n## \"What is the difference between VLOOKUP and XLOOKUP?\"\n\nThe most common opening question in finance interviews.\n\n**A weak answer:** XLOOKUP is newer and better.\n\n**A strong answer:** XLOOKUP looks in both directions, defaults to an exact match, and has a built-in not-found value. More importantly, it does not break when someone inserts a column, because it references ranges rather than counting column positions. The reason to still use VLOOKUP or INDEX/MATCH is compatibility — XLOOKUP returns `#NAME?` in Excel 2019 and earlier, so anything going to clients or auditors needs the older approach.\n\nThat last sentence is what separates the answers. It shows you have thought about who opens the file.\n\n## \"How would you find why a SUMIFS returns zero?\"\n\nThey are testing debugging, not knowledge.\n\n**The answer:** run `COUNTIFS` with identical criteria first. If the count is also zero, the criteria never match and the problem is in the data or the conditions — most often a trailing space, or numbers stored as text. If the count is right but the sum is zero, the problem is the sum range.\n\nAdding that you would check `ISNUMBER` on a sample cell, and `LEN` against `LEN(TRIM())` to detect stray whitespace, demonstrates you have actually hit this.\n\n## \"How do you handle errors in a model?\"\n\nA judgement question dressed as a technical one.\n\n**A weak answer:** wrap everything in IFERROR.\n\n**A strong answer:** it depends what the error means. An expected not-found case deserves `IFNA` with a readable message. A `#REF!` or `#DIV/0!` in a model is information — wrapping it hides a structural problem and produces a confident wrong number, which is worse than a visible failure. In a financial model I would keep errors visible on the calculation spine and only tidy the presentation layer.\n\nInterviewers in audit and finance react well to this, because they have all seen a model that returned zero instead of erroring.\n\n## \"Walk me through building a report from a monthly export\"\n\nThey want your process, not your formulas.\n\nA good answer has shape: keep the raw export untouched on its own sheet; clean it into a working table, using Power Query if the export recurs; build the aggregation with `SUMIFS` on a separate sheet; put the presentation on a third. Charts and reports read from the aggregation, never from the raw data.\n\nThen mention the reason: so that when next month's export has an extra column, one layer changes rather than the whole workbook.\n\n## \"What is wrong with merged cells?\"\n\nA quick test of whether you have been burned.\n\nThey break sorting, break filtering, break `Ctrl` plus arrow navigation, break PivotTables, and make ranges behave unpredictably in formulas. Centre Across Selection gives the same appearance with none of the damage. It sits in the Format Cells dialogue under Horizontal alignment.\n\n## \"How would you check somebody else's workbook?\"\n\nAn audit-flavoured question, and a good chance to show rigour.\n\nReasonable answers include: use Formulas, then Show Formulas, to see the logic rather than the results; use Trace Precedents on any figure that matters; look for hardcoded numbers inside formulas, which are the commonest source of silent error; check that totals actually sum the range they appear to; and recalculate with `Ctrl` `Alt` `Shift` `F9` to force a full rebuild in case something is stale.\n\nMentioning that you would check for values pasted over formulas is a strong detail. It happens constantly and it is invisible until you look.\n\n## \"What is a PivotTable's biggest weakness?\"\n\nThat it does not refresh automatically. It holds a cached copy of the data and shows old numbers with no warning until someone refreshes it. Anything going to other people should either be refreshed as a deliberate step or built with formulas that recalculate on open.\n\n## The practical test\n\nMany finance interviews now include a short exercise. Common tasks: build a summary by category from a transaction list, reconcile two lists and identify the differences, or clean a badly formatted export.\n\nThree things matter more than speed:\n\n**Talk while you work.** Explaining that you are checking for text-formatted numbers before writing the lookup tells them more than getting there silently.\n\n**Keep the raw data intact.** Working on a copy shows instinct they cannot teach.\n\n**Say what you would do differently with more time.** \"I would put this in Power Query if it were a recurring export\" turns a five-minute exercise into evidence of judgement.\n\n## What not to do\n\nDo not claim to be an Excel expert. It is an invitation to be tested, and the bar is higher than most people think. \"I use it daily for reconciliations and reporting, and I am comfortable with lookups, SUMIFS and PivotTables\" is more credible and easier to defend.\n\nDo not name-drop functions you have not used. Mentioning array formulas or LAMBDA to sound advanced goes badly when the follow-up question arrives.\n"
  },
  {
    "slug": "pivot-tables",
    "data": {
      "slug": "pivot-tables",
      "title": "Pivot tables without the mystique",
      "level": "Intermediate",
      "summary": "Summarise thousands of rows without writing a formula, and avoid the two traps that catch everyone.",
      "description": "How PivotTables actually work, when to use one instead of SUMIFS, and the refresh problem that produces confidently wrong reports.",
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 8,
      "related": [
        "SUMIFS",
        "COUNTIFS",
        "UNIQUE"
      ]
    },
    "body": "\nA PivotTable answers one question: how much, broken down by what.\n\nThat is the whole idea. Everything else is interface.\n\n## The one prerequisite\n\nYour data must be a clean table. One header row, one record per row, no blank rows in the middle, no merged cells, no subtotals mixed in.\n\nThis is not a style preference. A PivotTable reads the header row to name its fields and stops at the first blank row it meets. Break either rule and you get a PivotTable that is missing data without telling you it is missing data.\n\nIf you take nothing else from this guide: **the quality of a PivotTable is decided entirely before you create one.**\n\n## Building one\n\nSelect any cell in your data, then Insert, then PivotTable. You get four drop zones:\n\n- **Rows** — what you want listed down the side\n- **Columns** — what you want across the top\n- **Values** — what you want counted or added\n- **Filters** — what you want to restrict\n\nDrag Region to Rows and Amount to Values, and you have total sales by region. That is a report that would have taken a `SUMIFS` per region and a list of regions to write.\n\nAdd Month to Columns and you have a cross-tabulation. That would have taken a grid of formulas.\n\n## Where PivotTables beat formulas\n\n**Exploration.** You do not know what you are looking for yet. Dragging fields around and watching the summary change is genuinely faster than writing and rewriting formulas.\n\n**Unknown categories.** A `SUMIFS` needs you to know the regions in advance. A PivotTable discovers them. Add a new region to the source data and it appears on refresh.\n\n**Many dimensions at once.** Region by month by product would be a large grid of formulas and is three drags in a PivotTable.\n\n## Where formulas beat PivotTables\n\n**Anything that feeds something else.** A PivotTable's output moves as the data changes, so a formula pointing into it breaks. `SUMIFS` returns a value in a fixed cell that other formulas can rely on.\n\n**Fixed report layouts.** If the report must look a specific way every month, formulas give you exact control. PivotTables have opinions about layout that you will spend time overriding.\n\n**Anything a non-Excel person will open.** A PivotTable that has not been refreshed shows old numbers with no warning. A formula recalculates on open.\n\n## The refresh trap\n\nThis is the one that produces genuinely wrong reports.\n\n**A PivotTable does not update when the data changes.** It holds a cached copy from when it was last refreshed. Change the source, and the PivotTable keeps showing the old numbers, confidently, with no indication anything is stale.\n\nRight-click and Refresh, or `Alt` + `F5`, to update it.\n\nI have seen a board pack go out with month-old figures for exactly this reason. The data was updated, the PivotTable was not, and nothing on the page suggested a problem.\n\n**The habit worth forming:** refresh before you look, every time, without thinking about it.\n\n## The range trap\n\nThe second trap is subtler. If you create a PivotTable from `A1:D500` and then add rows 501 onwards, the PivotTable does not know about them. Refresh does not help — the range itself is fixed.\n\nThe fix is to format your data as a Table first: select it and press `Ctrl` + `T`. A Table expands automatically as rows are added, and a PivotTable built on one picks up new rows on refresh.\n\nDo this always. It costs one keystroke and removes an entire category of silent error.\n\n## Calculated fields\n\nYou can add your own calculations inside a PivotTable — a margin percentage, for instance — through PivotTable Analyze, then Fields, Items and Sets.\n\nUse these sparingly. They are invisible to anyone reading the workbook, they do not appear in the source data, and they behave unexpectedly with subtotals because the calculation happens on the aggregated figures rather than row by row.\n\nA calculated column in the source data is almost always the better answer. It is visible, it is checkable, and it behaves the way anyone would expect.\n\n## When to use which\n\nUse a PivotTable to explore data and to answer questions you have not asked before.\n\nUse formulas for anything that has to be reliable, repeatable, and readable by someone who did not build it.\n\nMost good workbooks contain both, doing different jobs.\n"
  },
  {
    "slug": "power-query",
    "data": {
      "slug": "power-query",
      "title": "Power Query, or how to clean data once",
      "level": "Advanced",
      "summary": "The single biggest time saver for anyone who receives the same messy file every month.",
      "description": "What Power Query does, why it beats both manual cleaning and macros, and the workflow that turns a two-hour monthly job into one click.",
      "updated": "2026-07-23T00:00:00.000Z",
      "readingTime": 9,
      "related": [
        "TRIM",
        "SUBSTITUTE",
        "LEFT",
        "UNIQUE"
      ]
    },
    "body": "\nIf you receive the same badly formatted export every month and clean it by hand every month, this is the article that gets those hours back.\n\nPower Query records your cleaning steps and replays them. Next month, you point it at the new file and press Refresh.\n\nIt is built into Excel from 2016 onwards, under Data, then Get Data. No installation, no licence, no VBA.\n\n## What problem it actually solves\n\nManual cleaning has three failures:\n\n- It takes the same time every month\n- The steps live in your head, so nobody else can do it\n- A step forgotten under time pressure produces a report that is wrong in a way nobody can see\n\nMacros solve the first two and introduce their own problems: they break when Excel updates, they need a macro-enabled file that many organisations block by email, and almost nobody can read someone else's VBA.\n\nPower Query solves all three and has none of those drawbacks. Its steps are listed in plain language down the right-hand side, so a colleague can read what you did without knowing any code.\n\n## The workflow\n\n**Load.** Data, then Get Data, then From File. Pick the messy export. You get a preview window, not a sheet full of data.\n\n**Clean.** Each action you take is recorded as a step:\n\n- Remove the top four rows of company letterhead\n- Promote the next row to headers\n- Change a column's type from text to number\n- Split a combined field on its delimiter\n- Filter out the subtotal rows\n- Trim whitespace from every text column\n\n**Load to the sheet.** Close and Load. The cleaned table appears, with the query attached.\n\n**Next month.** Save the new export over the old one, right-click the table, Refresh. Every step replays in order.\n\n## The steps that earn their keep\n\n**Remove Top Rows.** Exports from accounting systems begin with a title block. This removes it without you scrolling.\n\n**Use First Row as Headers.** After removing the letterhead, the real headers become row one. One click promotes them.\n\n**Change Type.** Power Query enforces types properly. A column declared as a number that contains \"n/a\" produces a visible error rather than silently failing to sum later.\n\n**Split Column by Delimiter.** The counterpart to `LEFT` and `MID`, done once rather than in a formula per row.\n\n**Unpivot Columns.** This one deserves special mention. Reports frequently arrive with months across the top — a shape that is readable for humans and useless for analysis. Select the month columns, right-click, Unpivot. You get one row per month per record, which is the shape PivotTables and `SUMIFS` need.\n\nDoing that by hand for a year of data is a genuinely miserable afternoon. Power Query does it in two clicks and does it identically every month.\n\n**Merge Queries.** A lookup, done at load time. Instead of a column of `XLOOKUP` formulas, the matched values arrive already in the table.\n\n## The habit that makes it worth it\n\nDo not clean data in the sheet.\n\nEvery time you find yourself deleting rows, using Find and Replace, or writing a helper column of `TRIM` formulas, ask whether the same thing will arrive next month. If it will, the cleaning belongs in Power Query.\n\nThe one-off cost is perhaps twenty minutes more than doing it by hand. The saving is every subsequent month, plus the certainty that the steps happen in the same order every time.\n\n## Where it does not fit\n\n**One-off analysis.** For a file you will never see again, cleaning by hand is faster.\n\n**Very large data.** Power Query is not fast on millions of rows. That is a database problem, not a spreadsheet one.\n\n**Live data.** Refresh is manual, or scheduled at best. Nothing here is real-time.\n\n## The honest caveat\n\nPower Query has a real learning curve, mostly because its interface does not look like Excel and its vocabulary is different. The first query you build will take longer than cleaning the file by hand, and it will feel like a poor trade.\n\nThe second one takes ten minutes. The third takes two.\n\nIf you receive a recurring export, that curve pays for itself within about three months and then keeps paying indefinitely. If you do not, you can safely ignore this entire article.\n"
  }
] as const;

export const BLOG_POSTS = [
  {
    "slug": "audit-trail",
    "data": {
      "slug": "audit-trail",
      "title": "The audit trail nobody builds until they need it",
      "category": "Spreadsheet design",
      "summary": "How to structure a workbook so you can answer \"where did this number come from\" six months later.",
      "description": "Practical steps for making a spreadsheet defensible — from an internal auditor who spends a lot of time asking exactly that question.",
      "updated": "2026-07-15T00:00:00.000Z",
      "readingTime": 7,
      "related": [
        "SUMIFS",
        "INDEX",
        "IFERROR"
      ]
    },
    "body": "\nThe question always arrives at the worst time. Someone asks where a number came from, and the honest answer is that you cannot reconstruct it.\n\nI ask this question professionally. What follows is what makes the answer easy, written from the perspective of the person doing the asking.\n\n## Why it matters even without an auditor\n\nYou are the main beneficiary of your own audit trail. Six months is long enough to forget your own reasoning entirely, and the workbook is the only record.\n\nThe cost of building the trail is perhaps twenty minutes. The cost of reconstructing one after the fact is measured in days, and sometimes it cannot be done at all.\n\n## Keep the source untouched\n\nThe raw export goes on its own sheet and nothing is done to it. No sorting, no deleting, no fixing.\n\nCleaning happens on a separate sheet that references it, or in Power Query. That way the original remains available for comparison, and \"does the cleaned data still match the export\" becomes a question you can answer rather than assert.\n\nThe commonest failure I see is a single sheet that has been cleaned in place over several months. There is no way to verify anything, because the thing it should be verified against no longer exists.\n\n## Every assumption in its own cell\n\nA number typed inside a formula is invisible. It cannot be found by searching, it cannot be reviewed, and it cannot be changed without editing formulas.\n\nPut assumptions in a labelled block — rate, threshold, date, whatever — and reference them. An assumptions sheet is the fastest thing to review and the first thing anyone competent will look at.\n\nAdd a note beside each one saying where the figure came from. \"Per Finance email 14 March\" takes five seconds and answers a question that would otherwise take an hour.\n\n## Make the calculation visible\n\nA long formula doing five things at once is hard to check and harder to explain.\n\n```\n=ROUND(IFERROR(INDEX(Rates!C:C, MATCH(A2, Rates!A:A, 0)), 0) * B2 * (1 + $D$2), 2)\n```\n\nBroken into three columns — rate, base amount, adjusted — it becomes reviewable, and when a number is wrong you can see immediately which step failed.\n\nExtra columns cost nothing. Reviewability is worth a great deal.\n\n## Date and version the file\n\n`Reconciliation.xlsx` tells nobody anything. `Reconciliation-2026-07-final.xlsx` tells them when, and `final-v2-updated` tells them the process was not controlled.\n\nUse dates in ISO order — 2026-07-23 — so files sort chronologically. It is a small thing that makes a folder navigable a year later.\n\n## Record what you did, not just what you got\n\nA short log sheet: date, what changed, why. Three columns and one line per change.\n\nThis feels bureaucratic until the first time someone asks why the March figure differs from the version they were sent. Then it is the most valuable sheet in the file.\n\n## Do not suppress errors on the calculation spine\n\nAn error is telling you something. Wrapping it in `IFERROR` and returning zero converts a visible problem into an invisible one and produces a confident wrong answer.\n\nUse `IFNA` where a missing value is genuinely expected. Leave everything else visible. A model that errors is a model that is telling you the truth.\n\n## Reconcile to something external\n\nThe strongest evidence a workbook can carry is agreement with something outside itself. A bank statement, a trial balance, a system report.\n\nPut the reconciliation in the file, with the difference calculated. A difference cell showing zero is the single most reassuring thing a reviewer can see, and if it is not zero you find out before somebody else does.\n\n## The test\n\nHand the file to a competent colleague with no explanation and ask them to tell you where one specific number came from.\n\nIf they can trace it back to a source without asking you anything, the trail exists. If they cannot, it does not — regardless of how well you understand it yourself.\n"
  },
  {
    "slug": "merged-cells",
    "data": {
      "slug": "merged-cells",
      "title": "Stop using merged cells",
      "category": "Spreadsheet design",
      "summary": "What breaks, why it breaks, and the formatting that gets the same look without the damage.",
      "description": "Merged cells break sorting, filtering, navigation and PivotTables. Centre Across Selection gives the identical appearance with none of the consequences.",
      "updated": "2026-07-12T00:00:00.000Z",
      "readingTime": 5,
      "related": [
        "SUMIFS",
        "COUNTIFS"
      ]
    },
    "body": "\nMerged cells look tidy. They are the single most reliable way to make a spreadsheet difficult to work with, and almost everyone who uses them does not know there is an alternative that looks identical.\n\n## What actually breaks\n\n**Sorting.** Excel refuses to sort a range containing merged cells, with an error that does not explain what to do about it. If you sort around them, the merged cell stays put while its data moves, and the labels end up attached to the wrong rows.\n\n**Filtering.** A merged cell spanning several rows shows its value only for the first. Filter on it and the other rows disappear, because as far as Excel is concerned they are empty.\n\n**Navigation.** `Ctrl` plus arrow stops at merged cells. On a sheet with merged headers, moving around by keyboard becomes unpredictable, and selecting a column with `Ctrl` `Space` selects more than you expected.\n\n**PivotTables.** A merged header row means the fields have no usable names. Excel either refuses to build the PivotTable or names the fields Column1, Column2, and so on.\n\n**Formulas.** A merged block holds its value in the top-left cell only. Every other cell in the block is genuinely empty, so `COUNTA` and `COUNTIFS` return numbers that look wrong and are technically correct.\n\n**Copy and paste.** Pasting into or out of a range with merged cells produces shape mismatches and an error message that does not identify the cause.\n\n## The replacement\n\nSelect the cells you would have merged. Right-click, Format Cells, Alignment tab, and set Horizontal to **Centre Across Selection**.\n\nThe text centres across the range exactly as merging would. Visually there is no difference at all.\n\nThe cells stay separate. Sorting works, filtering works, navigation works, PivotTables work, formulas count correctly.\n\nIt has been in Excel for decades and it is buried in a dialogue box, which is the entire reason people merge instead.\n\n## Where merging is acceptable\n\nA title cell at the top of a printed report, outside the data range, harms nothing. If it is not part of a table anyone will sort, filter or analyse, merge away.\n\nThe rule is about data. Above the data, do what you like.\n\n## Finding the ones you have\n\nHome, then Find and Select, then Find, then Options, then Format, then Alignment, and tick Merge cells. Find All lists every merged cell in the sheet.\n\nOn a workbook you have inherited this is often a long list, and it explains a surprising number of otherwise inexplicable problems.\n\n## Why this is worth caring about\n\nMerged cells are not a style disagreement. They break specific, common operations in ways that produce wrong answers rather than error messages.\n\nThe filtering case is the one that causes real damage: rows vanish from a filtered view, someone totals what remains, and the number is wrong with nothing to indicate it.\n\nCentre Across Selection takes four clicks and removes the entire category of problem.\n"
  },
  {
    "slug": "workbook-fragility",
    "data": {
      "slug": "workbook-fragility",
      "title": "Why your workbook breaks when someone else opens it",
      "category": "Spreadsheet design",
      "summary": "Hardcoded ranges, hidden assumptions, and the habits that make a spreadsheet survive being handed over.",
      "description": "The specific structural decisions that determine whether a workbook still works after it leaves your hands, drawn from auditing other people's spreadsheets.",
      "updated": "2026-07-20T00:00:00.000Z",
      "readingTime": 8,
      "related": [
        "SUMIFS",
        "XLOOKUP",
        "IFERROR"
      ]
    },
    "body": "\nA spreadsheet that works for you is not the same thing as a spreadsheet that works.\n\nThe difference only appears when someone else opens it — usually at month end, usually under time pressure, usually when you are unavailable. Auditing other people's workbooks for a living teaches you that the failures are remarkably consistent.\n\nHere are the ones worth designing against.\n\n## The hardcoded number inside a formula\n\n```\n=B12 * 1.175\n```\n\nSix months later the rate changes and nobody knows this cell exists. There is no way to find it except reading every formula.\n\nThe fix costs nothing: put the rate in its own labelled cell and reference it.\n\n```\n=B12 * $D$2\n```\n\nNow it is visible, it is changeable in one place, and anyone opening the file can see what assumption is being made. This is the cheapest structural improvement available and it is skipped more often than any other.\n\n**The test:** could someone find every assumption in this workbook without reading the formulas? If not, some of them are hidden.\n\n## The range that stopped growing\n\n```\n=SUMIFS(D2:D500, B2:B500, \"North\")\n```\n\nPerfect, until row 501. Then it silently excludes the new data. The total is wrong, the formula is not broken, and nothing indicates a problem.\n\nTwo fixes. Format the data as a Table with `Ctrl` `T`, which expands automatically. Or reference whole columns — `D:D` — which is slightly slower but never truncates.\n\nI prefer Tables, because they also give the ranges readable names. But whole columns are better than a fixed range that will quietly stop being right.\n\n## Values pasted over formulas\n\nSomeone needed to override one number, so they typed it in. The formula is gone and the cell looks identical to its neighbours.\n\nThis is genuinely hard to spot and it is everywhere. In an audit it is one of the first things to look for.\n\nThe defence is visual: give input cells a distinct format — blue text is the financial convention — so a typed value in a calculated column stands out. It does not prevent the override, but it makes it visible.\n\n## Merged cells\n\nThey look tidy. They break sorting, break filtering, break `Ctrl` plus arrow navigation, break PivotTables, and make ranges behave in ways that are difficult to predict.\n\nCentre Across Selection gives the same appearance with none of the consequences. It is in Format Cells, under Horizontal alignment, and almost nobody knows it is there.\n\n## Subtotals inside the data\n\nSomeone adds a subtotal row every ten records to make the sheet easier to read. Now every `SUMIFS` below it double-counts, and every PivotTable built on the range is wrong.\n\nThe data layer should contain only data. Summaries belong somewhere else, referencing it.\n\nThis is the same principle as separating presentation from data in a dashboard, and it is violated most often by people trying to be helpful.\n\n## IFERROR hiding a real failure\n\n```\n=IFERROR(VLOOKUP(A2, Ref!A:C, 3, FALSE), 0)\n```\n\nReasonable, until someone deletes a column in the reference sheet. The `VLOOKUP` now returns `#REF!`, `IFERROR` catches it, and the model reports zero. Confidently. Forever.\n\n`IFNA` catches only the not-found case and lets structural errors surface. In a model, an error is information — it is telling you something is broken, and suppressing it does not fix anything.\n\n## No indication of what the file is for\n\nOpen a workbook you did not build and the first question is: what is this, what does it need, and what does it produce?\n\nA single sheet at the front answering those three questions costs ten minutes and saves an hour every time someone new opens the file. Every template on this site has one for exactly this reason.\n\n## The pattern underneath\n\nAll of these share a shape. Each is a decision that was obvious to the person making it and invisible to everyone afterwards.\n\nThe habit that prevents most of them is asking one question before you save: **if I were not available, could someone else use this correctly?**\n\nNot \"could they work it out\" — could they use it correctly without knowing what you know. That question catches hardcoded assumptions, fixed ranges, hidden overrides and undocumented inputs, because every one of them fails it.\n"
  },
  {
    "slug": "xlookup-vs-alternatives",
    "data": {
      "slug": "xlookup-vs-alternatives",
      "title": "XLOOKUP, VLOOKUP or INDEX/MATCH",
      "category": "Formulas",
      "summary": "Which to use, when compatibility should override preference, and why the answer changes if your file goes to clients.",
      "description": "A practical comparison of Excel's three lookup approaches, focused on the deciding factor most articles skip — who opens the file.",
      "updated": "2026-07-18T00:00:00.000Z",
      "readingTime": 7,
      "related": [
        "XLOOKUP",
        "VLOOKUP",
        "INDEX",
        "MATCH"
      ]
    },
    "body": "\nMost comparisons of these three end with \"use XLOOKUP, it is better\". That is correct and incomplete, because it ignores the question that actually decides it.\n\n## The technical comparison, briefly\n\n| | VLOOKUP | INDEX/MATCH | XLOOKUP |\n|---|---|---|---|\n| Looks left | No | Yes | Yes |\n| Survives column insertion | No | Yes | Yes |\n| Default match type | Approximate | Exact | Exact |\n| Built-in not-found value | No | No | Yes |\n| Works in Excel 2019 | Yes | Yes | No |\n| Readability | Good | Fair | Good |\n\nOn the technical merits XLOOKUP wins on everything except the row that matters most.\n\n## The deciding question\n\n**Who opens this file?**\n\nIf the answer is \"me and my team, all on Microsoft 365\", use XLOOKUP. It is clearer, it is shorter, and its fourth argument removes the need to wrap it in `IFERROR`.\n\nIf the answer includes anyone outside your organisation — clients, auditors, suppliers, a regulator — you have a problem. XLOOKUP returns `#NAME?` in Excel 2019 and earlier. The file does not degrade gracefully. It arrives visibly broken, and the recipient's conclusion is that you sent them something faulty.\n\nPlenty of organisations run Excel 2019 or 2016, particularly in regulated industries where upgrades are slow. In audit work I still see it regularly.\n\n## Why VLOOKUP's weakness is worse than it sounds\n\nThe column index problem is not merely inconvenient. Consider:\n\n```\n=VLOOKUP(A2, Products!A:F, 4, FALSE)\n```\n\nThat returns column D. Someone inserts a column in the Products sheet — a perfectly reasonable thing to do — and now it returns what used to be column C.\n\n**No error appears.** The formula still works. It returns a real value from the wrong field, and the report is wrong in a way that looks entirely normal.\n\nINDEX/MATCH does not have this failure. Its ranges adjust when columns are inserted, because it references ranges rather than counting positions.\n\nThat single difference is why I would use INDEX/MATCH over VLOOKUP even before considering XLOOKUP.\n\n## The compatible answer\n\n```\n=INDEX(Prices!C:C, MATCH(A2, Prices!A:A, 0))\n```\n\nLonger than XLOOKUP, and it does everything VLOOKUP cannot: looks in any direction, survives structural changes, and works in every version of Excel back to the 1990s.\n\nThe `0` is not optional. Without it, MATCH does an approximate match on data it assumes is sorted, and on unsorted data returns whatever it happens to land on.\n\n## When approximate matching is right\n\nThere is one case where the approximate match is the point rather than a hazard: banding.\n\nTax brackets, commission tiers, volume discounts, shipping bands — all are \"find the largest threshold at or below this value\". That is exactly what `TRUE` in VLOOKUP, or match mode `-1` in XLOOKUP, does.\n\nTwo conditions must hold: the lookup column is numeric, and it is sorted ascending. Break either and the result is arbitrary with no warning.\n\n## What I would actually do\n\n**Internal file, modern Excel:** XLOOKUP. Use the fourth argument rather than wrapping in IFERROR.\n\n**Leaving the organisation:** INDEX/MATCH. Slightly longer, works everywhere, no apology needed.\n\n**Existing VLOOKUP that works:** leave it. Rewriting working formulas introduces risk for no gain. Change it when you are editing that area anyway.\n\n**Banding:** either, with the match type set deliberately and a note in the workbook explaining that the lookup column must stay sorted.\n\n## The part that gets skipped\n\nWhichever you choose, the failure mode is almost never the function. It is the data.\n\nA trailing space, a number stored as text, a non-breaking space pasted from a web page — these produce `#N/A` on values that look identical on screen, and swapping VLOOKUP for XLOOKUP does nothing about any of them.\n\nBefore debugging the formula, check the data with `=ISNUMBER(A2)` and `=LEN(A2)-LEN(TRIM(A2))`. That eliminates the most common causes in about thirty seconds.\n"
  }
] as const;
