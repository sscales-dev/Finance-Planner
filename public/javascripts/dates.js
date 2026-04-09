/** Date Manipulation Functions
 * 
 * Copied from Google Apps Script attached to Financial Planning Spreadsheet (previous iteration of this tool)
 * 
 */

function addOneMonth (isodate) {

}

function add28Days (isodate) {

}

/** ifDateWeekend
 * 
 * Takes the given date and adjusts it to the previous friday if it falls on a saturday or sunday
 */

function ifDateWeekend (date) {
  // Logger.log("Check paydate triggered for: " + date)

  // create date, d from given value 
    // [] review the formats etc
  let d = new Date(date)

  let newDate = new Date(date)
  let hour = 3600000

  let dayNo
  let temp
  let temp2
  let temp3

  // if day is sunday (0) || if day is saturday (6) - adjust date to previous Friday
  if (d.getDay() === 0) {
    dayNo = d.getDate() - 2

    newDate.setDate(dayNo)

  } else if (d.getDay() === 6) {
    dayNo = d.getDate() - 1

    newDate.setDate(dayNo)

  }

  // if the time is 11pm, add an hour
  if (newDate.getUTCHours() === 23) {
    temp2 = newDate.getTime()
    temp3 = temp2 + hour

    newDate = new Date(temp3)
    
  }

  // if no new date, throw error, otherwise, return date to a string value
  if (!newDate) {
    throw `Error checking day: no newDate`

  } else {
    //Logger.log(`Date Checked: New Value: ${newDate.toISOString()}`)

    return newDate

  }
}

/** Calculate Paydays
 * 
 * Takes the given start date and pay frequency (monthly or 28d/ four-weekly) and generates 36 dates in total (17 /monthly, 19 /28d)
 * it also outputs the frequencies alsongside the array of dates
 * 
 * @param {String} name - the name of the payday to get dates for
 * @return {Array}
 * @customfunction
*/

async function calculatePaydays (start_date, freq) {
  if (!start_date || !freq) {
    throw `calculatePaydays: Missing parameters!`

  }

  // create date from given date
    // [] check the given value's data types/ formats
  const start = new Date(start_date)
  
  let date
  let numPaym
  
  let newArr = []

  Logger.log(`Compiling Array of dates, ${freq} frequency, starting from: ${start_date}`)

  // switch between monthly our 28d/ 28d pay cycles (monthly x 17 & fourWeekly x 19)
  switch (freq) {
    case `monthly`: // loops through 17 paydays and pushes them to a new array
      Logger.log(`Calculating Monthly Paydates...`)

      // get full year and full month
      let year = start.getFullYear()
      const startMonth = start.getMonth()

      //set the month number
      let monthNum = startMonth + 1

      numPaym = 17 // 12 paydays for monthly

      // loop through the number of payments outlined, adjust if necessary, calls ifDateWeekend(date) and adds it to the array
      let i = 0

      for (i = 0; i < numPaym; i++) { 
        if (i === 0) { // if its the start date
          date = await ifDateWeekend(start)
          
        } else { // otherwise add a month to the date, check it falls on a weekday/ not
          let tempDate

          // Set the date to the last date + 1 month
          tempDate = new Date(`${year}-"${monthNum}-${start.getDate()}`)

          let temp = await ifDateWeekend(tempDate)

          date = temp

        }
        // set array value to be the date as an iso string
        let d = date.toISOString()

        // split the text string to remove the time value and add to array
        newArr[i] = d.split(`T`)[0]

        // add 1 to the month number (complete)
        monthNum += 1

        // if the year has ticked over, reset the values above the loop
        if (monthNum === 13) {
          monthNum = 1
          year += 1

        }
      }

      // if the new array is the right length, return it
      if (newArr.length === 17) {
        //Logger.log("Paydays List: " + newArr)

        // send to data validation list on out_once
        return newArr

      }
      break;
    case `28d`: // loops through 19 cycles of adding 4 wks in milliseconds, pushing to new array
      Logger.log(`Calculating 28d Paydates...`)

      // specify lengths of time in milliseconds
      let oneDay = 86400000
      let onePayCycle = oneDay * 28
      
      // number of dates to generate
      numPaym = 19
      
      // loop through the numPaym, if its the first one, just make date = start, otherwise add one paycycle x j (number of iterations) to the date variable
      let j = 0

      for (j = 0; j < numPaym; j++) {
        let current

        if (j === 0) {
          date = start

        } else {
          current = start.getTime() + (onePayCycle * j)

          date = new Date(current)

        }
        // set array value to be the date as an iso string
        let d = date.toISOString()

        // split the text string to remove the time value
        newArr[j] = d.split(`T`)[0]

      }

      // if the array is the right length, return it
      if (newArr.length === 19) {
        //Logger.log("Calculate Paydays: Array: " + newArr)

        return newArr

      }
      break;
    default: // throws error
      throw "calculatePaydays: No function outlined for frequency given"

  }
}

/** addPaydayLists
 * 
 * [] needs review
 * 
 */
async function addPaydayLists (pdl, freq) {
  freq = `monthly`//  `28d` // 
  pdl = await calculatePaydays(`2026-01-13`, freq) 
  // pdl = await calculatePaydays(`2026-01-13`, freq)

  if (!pdl) {
    throw `addPaydayListToOnce: Missing Parameters!`
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet()

  const checks = [0]

  const onceSheet = ss.getSheetByName(`one_time_out`)

  const startRow = 4
  const endInt = 35

  const monthlyCol = 16
  const fourWeeklyCol = 14

  let rule
  let check
  let cell

  switch (freq) {
    case `monthly`:
      if (pdl.length === 17) {
        rule = SpreadsheetApp.newDataValidation()
          .requireValueInList(pdl, true)
          .build();

        let x = 0

        for (x = 0; x < endInt; x++) {
          let rowNum = startRow + x

          check = onceSheet.getRange(rowNum, 19)

          if (check.getValue() === `head`) {
            continue;

          }

          cell = onceSheet.getRange(rowNum, monthlyCol)

          cell.setDataValidation(rule);

          checks[0] += 1

        }
      }
      
      if (checks[0] === endInt) {
        Logger.log(`Monthly Paydays List Outputted to Sheet`)

        return

      }

      break;

    case `28d`:
      if (pdl.length === 19) {
        rule = SpreadsheetApp.newDataValidation()
          .requireValueInList(pdl, true)
          .build();

        let y = 0

        for (y = 0; y < endInt; y++) {
          let rowNum = startRow + y

          check = onceSheet.getRange(rowNum, 19)

          if (check.getValue() === `head`) {
            continue;

          }

          cell = onceSheet.getRange(rowNum, fourWeeklyCol)

          cell.setDataValidation(rule);

          checks[0] += 1

        }
      }
      
      if (checks[0] === endInt) {
        Logger.log(`28d Paydays List Outputted to Sheet`)
        
        return

      }

      break;
  }
}

/** buildPaydaysArray
 * 
 *  Takes the given dates (monthly, then 28d)
 * 
 * @task add in the parameter options
 * 
 * @param {Date} arr1
 * @param {Date} arr2
 */
async function buildPaydaysArray (arr1, arr2) {
  if (arr1.length < 17 || arr2.length < 19) {
    throw `buildPaydaysArray: Missing Parameters!`

  }
  const newArr = []

  let i = 0

  for (i = 0; i < arr1.length; i++) {
    newArr.push([arr1[i], `monthly`]) //[arr1[i], `monthly`]
  }

  let j = 0

  for (j = 0; j < arr2.length; j++) {
    newArr.push([arr2[j], `28d`]) //[arr2[j], `28d`]

  }

  // if the new array is the right length (17 = 19), return it
  if (newArr.length === 36) {
    return newArr.sort()

  }
}

/** addDates function
 * 
 * @task - write description
 * @task - add date lists to _out_once columns - L & M - (data validated lists)
 * 
 * @param {Date/ String} d1
 * @param {Date/ String} d2
 */

async function addDates (arr1, arr2) {
  // [] should add option to enter Spreadsheet ID
  const ss = SpreadsheetApp.getActiveSpreadsheet()

  // fetch budget sheets and compile into array
  const budget1 = ss.getSheetByName(`~budget 1 (6m)`)
  const budget2 = ss.getSheetByName(`~budget 2 (6m)`)
  const budget3 = ss.getSheetByName(`~budget 3 (6m)`)

  const sheets = [budget1, budget2, budget3]

  // budget column integers
  const budgetColumns = fetchPropsArray(`budgetCols`)

  // calculate paydays for each given date and frequency
  const list1 = await calculatePaydays(arr1.date, arr1.freq)
  const list2 = await calculatePaydays(arr2.date, arr2.freq)

  // push dates to build paydays function >>
  const datesArray = await buildPaydaysArray (list1, list2)

  // Logs if dates array is compiled
  if (datesArray.length === 36) {
    Logger.log(`addDates: dates Array Compiled! ${datesArray}`)

    // Find the month of the given date
    const firstDate = new Date(datesArray[0][0])
    // Logger.log(`firstDate: ${firstDate}`)

    let monthSort = undefined
    let lastMonth = undefined

    const checks = [0, 0, 0, 0, 0]
    
    // loop through budget sheets (x3) and add data to appropriate places according to given dates
    let i = 0

    for (i = 0; i < sheets.length; i++) {
      Logger.log(`Iterating Sheets: ${1 + i}`)

      // set budget sheet and sheet number
      let sheetNum = i
      let budget = sheets[sheetNum]

      // loop through date columns per sheet
      let j = 0

      for (j = 0; j < budgetColumns.length; j++) {
        Logger.log(`Iterating Columns: ${1 + j}`)

        // select the column number
        let budgetCol = budgetColumns[j]
        let sortCol = 1 + new Number(budgetColumns[j])

        const dateRowNum = 3
        const columnInfoRow = 5

        // gets date, monthSort and income cells for the given column
        let dateCell = budget.getRange(dateRowNum, budgetCol)
        let freqCell = budget.getRange(columnInfoRow, budgetCol)
        let monthSortCell = budget.getRange(columnInfoRow, sortCol)

        let ind

        // sets index relative to budget sheet (+12 per completed sheet)
        if (sheetNum === 0) { // 12 iterations (0-11)
          ind = j

        } else if (sheetNum === 1) { // + 12 (12-23)
          ind = 12 + j

        } else if (sheetNum === 2) { // + 12 (24-35)
          ind = 24 + j

        }

        // Current Date
        let currentDate = new Date(datesArray[ind][0])
        Logger.log(`currentDate: ${currentDate.toISOString()}`)

        // converts the current date to a string
        let dateString = currentDate.toISOString()
        let isoDate = dateString.split('T')[0]
        let numbers = isoDate.split('-')

          let date = numbers[2]
          let month = numbers[1]
          let year = numbers[0]

        // set value and format on date cell
        dateCell.setValue(`${date}/${month}/${year}`)
        dateCell.setNumberFormat(`mmm-dd`)

        // Throw Error if value not set, otherwise log
        if (dateCell.getValue().toString() !== `${currentDate.toString()}`) {
          //Logger.log(`${dateCell.getValue()} and ${currentDate}`)
          throw `Date Value Not Set`

        } else {
          checks[1] += 1
          Logger.log(`addDates: Date Value Set: ${dateCell.getValue().toISOString()}`)

        }

        // Date Frequency
        const dateFreq = datesArray[ind][1]

        freqCell.setValue(dateFreq)

        if (freqCell.getValue() === dateFreq) {
          checks[2] += 1

        } else {
          throw `addDates: error seeting date frequency cell`

        }

        // Month Sort
        if (lastMonth === undefined && monthSort === undefined) {
          // set the last month to this month (marked as complete)
          lastMonth = firstDate.getMonth()

          // set the monthSort as 1 (new sheet)
          monthSort = 1

          Logger.log(`New Dates Array started: lastMonth: ${lastMonth}, monthSort: ${monthSort} - properties set`)

        } else {
          // Logger.log(`lastMonth: ${lastMonth}`)
          // Logger.log(`monthSort: ${monthSort}`)

        }
        
        // if the current month is larger than the last month, add one to the monthSort
        if (currentDate.getMonth() !== lastMonth){
          monthSort += 1

        }

        // set monthSort value for column
        monthSortCell.setValue(monthSort)

        if (monthSortCell.getValue() === monthSort) {
          //Logger.log('Month Sort Number Set: ' + monthSortCell.getValue())
          checks[0] += 1

        } else {
          throw `addDates: Error setting month sort value`

        }

        // End Dates
        if (budget.getName() === `~budget 3 (6m)` && j >= (budgetColumns.length -2)) {
          let endDate

          // calculate end dates for sheet based on given dates
          if (currentDate.getMonth() === 11) {
            Logger.log(`write code for year turnover on emd dates`)

          } else {
            let tempDate

            if (dateFreq === `monthly`) {
              tempDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 2}-${currentDate.getDate()}`
              
              endDate = ifDateWeekend(tempDate).toISOString().split('T')[0] //tempDate2.split('T')[0]

              Logger.log(`monthly paydate: endDate: ${endDate}`)

            } else if (dateFreq === `28d`) {
              let oneDay = 86400000
              let onePayCycle = oneDay * 28

              tempDate = new Date(currentDate.getTime() + onePayCycle)
              endDate = tempDate.toISOString().split('T')[0]

              Logger.log(`28d paydate: endDate: ${endDate}`)
              
            }
          }

          Logger.log(`budgetCol: ${budgetCol}, type: ${typeof budgetCol}`)

          let endFormula

          let budgetColRef
          let actualColRef

          // specify A1 Notations values for last 2 columns (AT-AY)
          if (budgetCol == 46) {
            budgetColRef = "AT"
            actualColRef = "AU"

          }

          if (budgetCol == 50) {
            budgetColRef = "AX"
            actualColRef = "AY"

          }

          const categoryRows = fetchPropsArray(`categoryRows`)

          let x = 0

          for (x = 0; x < categoryRows.length; x++) {
            if (budgetColRef === undefined || actualColRef === undefined) {
              throw `addDates: Error setting column references on end formula: Column Number: ${budgetCol}`

            }
            let categoryRow = categoryRows[x]

            endFormula = `=IFS(${budgetColRef}$${columnInfoRow}="monthly",SUM(SUM_REPEAT_MONTHLY($C${categoryRow},${budgetColRef}$3,"${endDate}",${actualColRef}$${columnInfoRow}),SUM_OUT_MONTHLY(${budgetColRef}$3,$C${categoryRow})),${budgetColRef}$${columnInfoRow}="28d",SUM(SUM_REPEAT_28D($C${categoryRow},${budgetColRef}$3,"${endDate}",${actualColRef}$${columnInfoRow}),SUM_OUT_28D(${budgetColRef}$3,$C${categoryRow})))`

            let cell =  budget.getRange(categoryRow, budgetCol)

            cell.setValue(endFormula)

          }

          let r = budget.getRange(58, budgetCol)

          if (r.getFormula() === endFormula) {
            checks[3] += 1

          }
        }

        lastMonth = currentDate.getMonth()
      }
    }

    if (checks[0] === 36 && checks[1] === 36 && checks[2] === 36 && checks[3] === 2) {
      Logger.log(`Spreadsheet amended!`)
      return

    } else {
      Logger.log(checks)

      throw `addDates: Error configuring sheets`

    }
  }
}