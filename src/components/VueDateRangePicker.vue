<template>
  <div class="mnx-dtp" :style="theme">
    <!--  the textbox that shows the current date or range date   -->
    <input
      type="text"
      :label="label"
      v-model="value"
      class="mnx-dtp-input"
      @focus="onInputSelect"
      v-if="!this.elem"
    />
    <div
      class="mnx-dtp-container"
      v-if="isOpen"
      :class="{ 'range-is-enabled': range }"
    >
      <!--   header of date picker   -->
      <div class="mnx-dtp-header" v-if="!range">
        <div class="year-container">
          {{ this.selectedDateArray[0] }}
        </div>
        <div class="month-container">
          {{ this.formattedDayOfWeek }}
        </div>
      </div>
      <div class="mnx-dtp-header range-header" v-else>
        <div class="header-container">
          <div class="month-container">
            {{ this.formattedRangeOfDates[0] || "تاریخ شروع انتخاب نشده است" }}
            <span
              v-if="time"
              class="time-picker-button"
              @click="setManualTimeForDateRange(0)"
              :class="{ disabled: !this.rangeDateArray[0] }"
              >تغییر ساعت و دقیقه</span
            >
          </div>
          <div class="month-container">
            {{ this.formattedRangeOfDates[1] || "تاریخ پایان انتخاب نشده است" }}
            <span
              v-if="time"
              class="time-picker-button"
              @click="setManualTimeForDateRange(1)"
              :class="{ disabled: !this.rangeDateArray[1] }"
              >تغییر ساعت و دقیقه</span
            >
          </div>
        </div>

        <!--        <div class="header-options">-->
        <!--          <slot name="header-options"></slot>-->
        <!--        </div>-->
      </div>
      <div
        v-if="!isGoingToSelectTime && !isGoingToSelectYearAndMonth.active"
        class="mnx-dtp-months-wrapper"
      >
        <div class="single-month-container" v-if="!range">
          <!--   the container that shows the current month and year ====>>>>> 'آبان 1398'  -->
          <div class="mnx-dtp-month-selection">
            <div class="prev-month" @click="parsePreviousMonth">
              <span></span>
            </div>
            <div class="current-month">
              {{ this.formattedFirstYearAndMonth }}
            </div>
            <div class="next-month" @click="parseNextMonth">
              <span></span>
            </div>
          </div>
          <!--   the container that shows days of week    -->
          <div class="days-of-week-container">
            <div class="days-of-week" v-for="day in this.daysOfWeek" :key="day">
              {{ day }}
            </div>
          </div>
          <!--   the container that shows the current days of month   -->
          <div class="days-container">
            <!--    spaces before first day of month that puts the first day of month in the right position     -->
            <!--    for example : azar 1st starts in 2 shanbe, third day of the week,
                    so we need 2 mock cells to push the first day forward   -->
            <div
              class="day mock-day"
              v-for="(mockDay, mockDayIndex) in firstDayOfFirstMonthInWeek"
              :key="'mock-' + mockDayIndex"
            ></div>
            <div
              class="day"
              v-for="day of this.datetimePickerObj.monthsArray.firstMonth.days"
              @click="selectDate(day)"
              :key="day.internalDateId"
              :class="{
                'day-disabled': day.disabled,
                today: day.internalDateId === today.internalDateId
              }"
            >
              <div
                class="day-cell"
                :class="{
                  'selected-date':
                    day.internalDateId === selectedInternalDateId,
                  'selected-in-range': day.isActivatedInRange === true
                }"
              >
                {{ day.date[2] }}
              </div>
            </div>
          </div>
        </div>

        <div class="double-month-container" v-else>
          <div class="first-month">
            <div class="mnx-dtp-month-selection">
              <div class="prev-month" @click="parsePreviousMonth">
                <span></span>
              </div>
              <div
                class="current-month"
                @click="
                  isGoingToSelectYearAndMonth = { active: true, type: 'year' }
                "
              >
                {{ this.formattedFirstYearAndMonth }}
              </div>
              <div class="next-month" @click="parseNextMonth">
                <span></span>
              </div>
            </div>
            <!--   the container that shows days of week    -->
            <div class="days-of-week-container">
              <div
                class="days-of-week"
                v-for="day in this.daysOfWeek"
                :key="day"
              >
                {{ day }}
              </div>
            </div>
            <!--   the container that shows the current days of month   -->
            <div class="days-container">
              <!--    spaces before first day of month that puts the first day of month in the right position     -->
              <!--    for example : azar 1st starts in 2 shanbe, third day of the week,
                        so we need 2 mock cells to push the first day forward   -->
              <div
                class="day mock-day"
                v-for="(mockDay, mockDayIndex) in firstDayOfFirstMonthInWeek"
                :key="'mock-' + mockDayIndex"
              ></div>
              <div
                class="day"
                v-for="day of this.datetimePickerObj.monthsArray.firstMonth
                  .days"
                @click="selectDate(Object.create(day))"
                :key="day.internalDateId"
                :class="{
                  'is-first-day': day.isFirstDay,
                  'is-last-day': day.isLastDay,
                  'selected-in-range': day.isActivatedInRange === true,
                  'selected-date':
                    day.internalDateId === selectedInternalDateId,
                  'day-disabled': day.disabled,
                  today: day.internalDateId === today.internalDateId
                }"
              >
                <div class="day-cell">
                  {{ day.date[2] }}
                </div>
              </div>
            </div>
          </div>
          <div class="second-month">
            <div class="mnx-dtp-month-selection">
              <div class="prev-month" @click="parsePreviousMonth">
                <span></span>
              </div>
              <div
                class="current-month"
                @click="
                  isGoingToSelectYearAndMonth = { active: true, type: 'year' }
                "
              >
                {{ this.formattedSecondYearAndMonth }}
              </div>
              <div class="next-month" @click="parseNextMonth">
                <span></span>
              </div>
            </div>
            <!--   the container that shows days of week    -->
            <div class="days-of-week-container">
              <div
                class="days-of-week"
                v-for="day in this.daysOfWeek"
                :key="day"
              >
                {{ day }}
              </div>
            </div>
            <!--   the container that shows the current days of month   -->
            <div class="days-container">
              <!--    spaces before first day of month that puts the first day of month in the right position     -->
              <!--    for example : azar 1st starts in 2 shanbe, third day of the week,
                        so we need 2 mock cells to push the first day forward   -->
              <div
                class="day mock-day"
                v-for="(mockDay, mockDayIndex) in firstDayOfSecondMonthInWeek"
                :key="'mock-' + mockDayIndex"
              ></div>
              <div
                class="day"
                v-for="day of this.datetimePickerObj.monthsArray.secondMonth
                  .days"
                @click="selectDate(Object.create(day))"
                :key="day.internalDateId"
                :class="{
                  'is-first-day': day.isFirstDay,
                  'is-last-day': day.isLastDay,
                  'selected-in-range': day.isActivatedInRange === true,
                  'selected-date':
                    day.internalDateId === selectedInternalDateId,
                  'day-disabled': day.disabled,
                  today: day.internalDateId === today.internalDateId
                }"
              >
                <div class="day-cell">
                  {{ day.date[2] }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  time-picker container for each selected date in range   -->
      <div v-if="isGoingToSelectTime" class="time-picker-container">
        <div class="close-btn" @click="goToDefaultCalendar">X</div>
        <div class="time-selection-container">
          <div class="minute-container">
            <div class="top-arrow" @click="timeIterator('increase', 'minute')">
            </div>
            <div class="time-shower">
              {{ currentSelectedTime.minute | prependZeroToTime }}
            </div>
            <div
              class="bottom-arrow"
              @click="timeIterator('decrease', 'minute')"
            >
            </div>
          </div>
          <div class="two-dots">:</div>
          <div class="hour-container">
            <div class="top-arrow" @click="timeIterator('increase', 'hour')">
            </div>
            <div class="time-shower">
              {{ currentSelectedTime.hour | prependZeroToTime }}
            </div>
            <div class="bottom-arrow" @click="timeIterator('decrease', 'hour')">
            </div>
          </div>
        </div>
        <div class="confirm-button-container">
          <button class="confirm" @click="setTimeForDate()">تایید</button>
          <button class="cancel" @click="goToDefaultCalendar">لغو</button>
        </div>
      </div>
      <!--  year and month selection container   -->
      <div
        class="year-month-selection-wrapper"
        v-if="isGoingToSelectYearAndMonth.active"
      >
        <div class="close-btn" @click="goToDefaultCalendar">X</div>
        <div class="year-month-navigation-bar">
          <div class="prev-month" @click="generateYearSelectionArray('-')">
            <span></span>
          </div>
          <div class="current-month">
            <div v-if="this.monthYearSelectionArray.length === 0">
              {{ this.yearSelectionArray[0] }} -
              {{ this.yearSelectionArray[this.yearSelectionArray.length - 1] }}
            </div>
            <div
              v-if="this.monthYearSelectionArray.length === 1"
              @click="backToYearSelection"
            >
              {{ this.monthYearSelectionArray[0] }}
            </div>
          </div>
          <div class="next-month" @click="generateYearSelectionArray('+')">
            <span></span>
          </div>
        </div>
        <div
          class="year-selection-wrapper"
          v-if="isGoingToSelectYearAndMonth.type === 'year'"
        >
          <div
            class="year"
            v-for="year of this.yearSelectionArray"
            :key="year"
            @click="yearItemSelected(year)"
            :class="{ 'current-active-year': year === activeYear }"
          >
            {{ year }}
          </div>
        </div>
        <div
          class="month-selection-wrapper"
          v-if="isGoingToSelectYearAndMonth.type === 'month'"
        >
          <div
            class="month"
            v-for="month of this.monthsOfYearSelectionArray"
            :key="month.id"
            @click="monthItemSelected(month)"
          >
            {{ month.name }}
          </div>
        </div>
      </div>
      <div class="action-bar-container">
        <button class="confirm" :disabled="!isConfirmButtonActive">تایید</button>
        <button class="cancel" @click="clearDateRanges">لغو</button>
        <button class="close">بازگشت</button>
      </div>
    </div>
    <div class="mnx-dtp-mask" v-if="isOpen" @click="onInputSelect"></div>
  </div>
</template>

<script>
import PersianDate from "persian-date";

export default {
  name: "ManexDateTimePicker",
  props: {
    // used to create v-model
    value: {},
    label: {
      required: true,
      type: String
    },
    // the format of returned date
    format: {
      default: ""
    },
    // enable or disable range mode
    range: {
      type: Boolean,
      default: false
    },
    // custom input element which be bound to date picker
    elem: {
      type: String
    },
    // minimum date to select ====>>>> 1398/3/16
    min: {
      type: String
    },
    // maximum date to select ====>>>> 1398/3/16
    max: {
      type: String
    },
    // The option that allows user to select time for each selected date in range
    time: {
      type: Boolean
    },
    themeColor: {
      type: String,
      default: "#007BFF"
    }
  },
  data() {
    return {
      // check whether the dialog is open or not
      isOpen: false,
      // the main object that stores the content of datepicker
      datetimePickerObj: {
        monthsArray: {
          firstMonth: {
            month: [],
            days: []
          },
          secondMonth: {
            month: [],
            days: []
          }
        }
      },
      daysOfWeek: ["ش", "ی", "د", "س", "چ", "پ", "ج"],
      selectedDateArray: [], // [1398, 4, 23]
      currentMonthArray: [], // [1398, 4]
      formattedFirstYearAndMonth: null, // the content of the month navigator ====>>>> 'آبان 1398'
      formattedSecondYearAndMonth: null, // the content of the next month navigator ====>>>> 'آبان 1398'
      formattedDayOfWeek: null, // the content of the header of datepicker ====>>>> 'سه شنبه, ۲۱ آبان'
      formattedRangeOfDates: [], // the content of the header of datepicker
      selectedInternalDateId: null, // "mnx-dtp-1398-12-23" => used to style selected date in `non range` mode
      rangeDateArray: [], // array of first and second selected element
      // that has been clicked to form a range of dates
      selectedDatesInRangeArray: [], // the array that stores dates which in the range of `rangeDateArray`
      minDateInMilliseconds: null, // this.min converted to milliseconds
      maxDateInMilliseconds: null, // this.max converted to milliseconds
      isGoingToSelectTime: false, // flag that raised when the user wants to select time
      isGoingToSelectYearAndMonth: { active: false, type: null }, // flag that raised when the user wants
      // to select year and month, used in 'year-month-selection-wrapper'
      currentSelectedTime: { hour: 0, minute: 0 }, // The object that contains drafted time which user selected
      yearSelectionArray: [], //The Array contains 16 months to select ====>>>> [1398, 1399, 1400, ... , 1412, 1413]
      // used in 'year-month-selection-wrapper'
      monthsOfYearSelectionArray: [
        { id: 1, name: "فروردین" },
        { id: 2, name: "اردیبهشت" },
        { id: 3, name: "خرداد" },
        { id: 4, name: "تیر" },
        { id: 5, name: "مرداد" },
        { id: 6, name: "شهریور" },
        { id: 7, name: "مهر" },
        { id: 8, name: "آبان" },
        { id: 9, name: "آذر" },
        { id: 10, name: "دی" },
        { id: 11, name: "بهمن" },
        { id: 12, name: "اسفند" }
      ], // The Array of months that used for month selection, used in 'year-month-selection-wrapper'
      monthYearSelectionArray: [], // user selected year and month, used in 'year-month-selection-wrapper'
      activeYear: null, // current year, used in 'year-month-selection-wrapper'
      today: null
    };
  },
  created() {
    this.today = this.createDateObjectUnit(new PersianDate());

    if (this.value) {
      // set default value for date
      let selectedDateInstance = this.parseStringToValidDate(this.value);
      // let selectedNextMonthInstance = new PersianDate(this.value).add("m", 1);
      let addedDateObject = this.createDateObjectUnit(selectedDateInstance);

      this.currentMonthArray = addedDateObject.date; // sets the month to initial value month
      this.populateAndRenderMonthsArray(selectedDateInstance); // generate month's days based on initial date value
      this.selectDate(addedDateObject); // selects date
      this.generateYearSelectionArray("");
      this.emitDateRanges();
    } else {
      this.populateAndRenderMonthsArray();
      this.generateYearSelectionArray("");
    }
  },
  mounted() {
    // bound passed element (with specific id), to date range picker
    if (this.elem) {
      document.getElementById(this.elem).addEventListener("click", () => {
        this.isOpen = !this.isOpen;
      });
    }
  },
  methods: {
    onInputSelect() {
      this.isOpen = !this.isOpen;
    },
    populateAndRenderMonthsArray(date) {
      let currentDateArray = [];
      let firstDayOfMonth = [];
      let firstDayOfNextMonth = [];
      let currentDate;

      // check if persisted date has been passed
      if (date) {
        currentDate = new PersianDate(date);
      } else {
        currentDate = new PersianDate();
      }

      // make current date in an array
      currentDateArray = this.createRawDateArray(currentDate);

      this.currentMonthArray = currentDateArray;
      this.activeYear = this.currentMonthArray[0];

      // store current month and next month
      firstDayOfMonth = [currentDateArray[0], currentDateArray[1], 1];
      if (currentDateArray[1] === 12) {
        firstDayOfNextMonth = [currentDateArray[0] + 1, 1, 1];
      } else {
        firstDayOfNextMonth = [currentDateArray[0], currentDateArray[1] + 1, 1];
      }

      this.datetimePickerObj.monthsArray.firstMonth.days = this.makeDaysOfMonth(
        firstDayOfMonth
      );
      this.datetimePickerObj.monthsArray.firstMonth.month = [
        currentDateArray[0],
        currentDateArray[1]
      ];
      this.datetimePickerObj.monthsArray.secondMonth.days = this.makeDaysOfMonth(
        firstDayOfNextMonth
      );

      if (currentDateArray[1] === 12) {
        this.datetimePickerObj.monthsArray.secondMonth.month = [
          currentDateArray[0] + 1,
          1
        ];
      } else {
        this.datetimePickerObj.monthsArray.secondMonth.month = [
          currentDateArray[0],
          currentDateArray[1] + 1
        ];
      }

      this.formatYearAndMonth();
    },
    convertToPersianNumber(str) {
      const persianNumberArr = [
        /۰/g,
        /۱/g,
        /۲/g,
        /۳/g,
        /۴/g,
        /۵/g,
        /۶/g,
        /۷/g,
        /۸/g,
        /۹/g
      ];
      const arabicNumberArr = [
        /٠/g,
        /١/g,
        /٢/g,
        /٣/g,
        /٤/g,
        /٥/g,
        /٦/g,
        /٧/g,
        /٨/g,
        /٩/g
      ];
      if (typeof str === "string") {
        let i = 0;
        for (; i < 10; i++) {
          str = str
            .replace(persianNumberArr[i], i)
            .replace(arabicNumberArr[i], i);
        }
      }
      return str;
    },
    makeDaysOfMonth(startDate) {
      const isLeapYear = new PersianDate(startDate).isLeapYear(); // check if year is leap year
      let daysOfMonth = this.getDaysOfMonth(startDate[1], isLeapYear); // get count of days in the month
      let monthArray = [];

      for (let i = 1; i <= daysOfMonth; i++) {
        let dateObject = {};
        dateObject.isHoliday = false;
        dateObject.date = [startDate[0], startDate[1], i];
        dateObject.dayOfWeek = this.convertToPersianNumber(
          new PersianDate(dateObject.date).format("d")
        );
        dateObject.internalDateId = this.internalDateIdGenerator(
          dateObject.date
        );

        // if we have range and have 2 range dates in array, generate
        if (this.range && this.rangeDateArray.length === 2) {
          let isDateObjectInRange = this.selectedDatesInRangeArray.find(
            p => p.internalDateId === dateObject.internalDateId
          );

          if (isDateObjectInRange) {
            dateObject.isActivatedInRange = true;
            dateObject.isFirstDay = isDateObjectInRange.isFirstDay;
            dateObject.isLastDay = isDateObjectInRange.isLastDay;
          }
        }

        if (this.min || this.max) {
          dateObject.disabled = this.compareDateToMinAndMaxDate(dateObject);
        }

        monthArray.push(dateObject);
      }

      return monthArray;
    },
    // factory function that returns day count of month
    getDaysOfMonth(month, isLeapYear) {
      if (month < 7) {
        return 31;
      } else {
        if (month === 12) {
          if (isLeapYear) {
            return 30;
          } else {
            return 29;
          }
        } else {
          return 30;
        }
      }
    },
    parseNextMonth() {
      // Push `this.datetimePickerObj.monthsArray` one month forward
      let newlyCreatedDate = this.datetimePickerObj.monthsArray.secondMonth
        .month;
      newlyCreatedDate.push(1);

      // re-render months by new `monthsArray` object object
      this.populateAndRenderMonthsArray(newlyCreatedDate);
    },
    parsePreviousMonth() {
      let newlyCreatedDate = this.datetimePickerObj.monthsArray.firstMonth
        .month;
      // Push `this.datetimePickerObj.monthsArray` one month backward
      if (newlyCreatedDate[1] === 1) {
        newlyCreatedDate[1] = 12;
        newlyCreatedDate[0] = newlyCreatedDate[0] - 1;
      } else {
        newlyCreatedDate[1] = newlyCreatedDate[1] - 1;
      }

      newlyCreatedDate.push(1);

      // re-render months by new `monthsArray` object object
      this.populateAndRenderMonthsArray(newlyCreatedDate);
    },
    // format year and month header in single date selection
    formatYearAndMonth() {
      let selectedMonth = new PersianDate(this.currentMonthArray);
      let selectedDate = new PersianDate(this.selectedDateArray);
      let nextSelectedMonth = selectedMonth.add("M", 1);
      this.formattedDayOfWeek = selectedDate.format("dddd, DD MMMM");
      this.formattedFirstYearAndMonth = selectedMonth.format("MMMM YYYY");
      this.formattedSecondYearAndMonth = nextSelectedMonth.format("MMMM YYYY");
    },
    // format year and month header in range date selection
    formatRangeOfDates() {
      let selectedMonth = new PersianDate(this.currentMonthArray);
      let nextSelectedMonth = selectedMonth.add("M", 1);
      this.formattedFirstYearAndMonth = selectedMonth.format("MMMM YYYY");
      this.formattedSecondYearAndMonth = nextSelectedMonth.format("MMMM YYYY");

      let timeHeaderFormat = this.time ? "dddd, DD MMMM YYYY, HH:mm" : "dddd, DD MMMM YYYY";

      if (this.rangeDateArray[0]) {
        // because if the range is selected, the next click that removes the range,
        // should remove the second `formattedRangeOfDates`
        this.formattedRangeOfDates[1] = this.formattedRangeOfDates[1]
          ? null
          : this.formattedRangeOfDates[1];

        this.formattedRangeOfDates[0] = new PersianDate(
          this.rangeDateArray[0].date
        ).format(timeHeaderFormat);
      }

      if (this.rangeDateArray[1]) {
        this.formattedRangeOfDates[1] = new PersianDate(
          this.rangeDateArray[1].date
        ).format(timeHeaderFormat);
      }
    },
    // 'internalDateId' generator for each date ====>>>> [1398, 12,23] => mnx-dtp-1398-12-23
    internalDateIdGenerator(dateArray) {
      return (
        "mnx-dtp" + "-" + dateArray[0] + "-" + dateArray[1] + "-" + dateArray[2]
      );
    },
    selectDate(dayObj) {
      // creates a new day object instance each time, because if the 2 selected dates
      // is in 1 day, the reference of 2 selected date objects link to each other,
      // that cause some bugs, specially  in time-selection
      let dayObject = this.createDateObjectUnit(new PersianDate(dayObj.date));

      this.selectedInternalDateId = dayObj.internalDateId;

      // check for range is enabled
      if (this.range) {
        switch (this.rangeDateArray.length) {
          // reset range date array
          case 2: {
            this.rangeDateArray = [];
            this.rangeDateArray.push(dayObject);
            // clear `isActivatedInRange` for date items
            this.clearDateRanges();
            break;
          }
          // populate range dates
          case 1: {
            this.rangeDateArray.push(dayObject);
            this.populateDateRanges();
            this.emitDateRanges();
            break;
          }
          // in case that user clicked the first date for the FIRST TIME
          case 0: {
            this.rangeDateArray = [];
            this.rangeDateArray.push(dayObject);
            break;
          }
        }

        this.formatRangeOfDates();
      } else {
        // used for non range mode
        this.selectedDateArray = dayObject.date;
        const selectedDate = new PersianDate(dayObject.date).format(
          this.format
        );
        this.formatYearAndMonth();
        this.$emit("input", selectedDate);
      }
    },
    // emit data of ranges
    emitDateRanges() {
      const firstDate = new PersianDate(this.rangeDateArray[0].date).format(
        this.format
      );
      const secondDate = new PersianDate(this.rangeDateArray[1].date).format(
        this.format
      );
      const emittedDates = firstDate + " - " + secondDate;
      this.$emit("input", emittedDates);
    },
    createDateObjectUnit(dateInstance) {
      // make current date in an array
      let currentDateArray = this.createRawDateArray(dateInstance);

      let dateObject = {};
      dateObject.date = currentDateArray;
      dateObject.isFirstDay = false;
      dateObject.isLastDay = false;
      dateObject.internalDateId = this.internalDateIdGenerator(dateObject.date);

      return dateObject;
    },
    // example output: [1398, 3, 16]
    createRawDateArray(dateInstance) {
      let dateArray = [];
      // make date in an array
      dateArray[2] = parseInt(
        this.convertToPersianNumber(dateInstance.format("D"))
      );
      dateArray[1] = parseInt(
        this.convertToPersianNumber(dateInstance.format("M"))
      );
      dateArray[0] = parseInt(
        this.convertToPersianNumber(dateInstance.format("YYYY"))
      );

      return dateArray; // example output: [1398, 3, 16]
    },
    populateDateRanges() {
      this.sortRangeDate();
      this.clearDateRanges();

      let firstDay = this.rangeDateArray[0];
      let secondDay = this.rangeDateArray[1];

      let firstDayDate = new PersianDate(firstDay.date);
      let secondDayDate = new PersianDate(secondDay.date);

      let daysDiff = secondDayDate.diff(firstDayDate, "days");

      for (let i = 0; i < daysDiff; i++) {
        let addedDateInstance = firstDayDate.add("d", i);
        let addedDateObject = this.createDateObjectUnit(addedDateInstance);

        // determine which object is first day in range
        if (i === 0) {
          addedDateObject.isFirstDay = true;
        }

        // determine which object is last day in range
        if (i + 1 === daysDiff) {
          addedDateObject.isLastDay = true;
        }

        this.selectedDatesInRangeArray.push(addedDateObject);
      }

      this.populateAndRenderMonthsArray(
        this.datetimePickerObj.monthsArray.firstMonth.days[0].date
      );
    },
    sortRangeDate() {
      let dateOne = new PersianDate(this.rangeDateArray[0].date).format("X");
      let dateTwo = new PersianDate(this.rangeDateArray[1].date).format("X");

      if (dateOne > dateTwo) {
        this.rangeDateArray = this.rangeDateArray.reverse();
      }

      if (this.time) {
      this.rangeDateArray[0].date[3] = 0;
      this.rangeDateArray[0].date[4] = 0;

      this.rangeDateArray[1].date[3] = 23;
      this.rangeDateArray[1].date[4] = 59;
      }
    },
    clearDateRanges() {
      this.selectedDatesInRangeArray = [];
      this.datetimePickerObj.monthsArray.firstMonth.days.forEach(item => {
        item.isActivatedInRange = false;
        item.isFirstDay = false;
        item.isLastDay = false;
      });
      this.datetimePickerObj.monthsArray.secondMonth.days.forEach(item => {
        item.isActivatedInRange = false;
        item.isFirstDay = false;
        item.isLastDay = false;
      });

      this.formatRangeOfDates();
    },
    parseStringToValidDate(stringDate) {
      let splittedDate = stringDate.split("/");

      splittedDate[2] = parseInt(splittedDate[2]);
      splittedDate[1] = parseInt(splittedDate[1]);
      splittedDate[0] = parseInt(splittedDate[0]);

      return new PersianDate(splittedDate);
    },
    compareDateToMinAndMaxDate(date) {
      const dateInstance = new PersianDate(date.date).format("X");
      let isLowerThanMin = false;
      let isHigherThanMax = false;

      if (!this.minDateInMilliseconds) {
        this.minDateInMilliseconds = this.parseStringToValidDate(
          this.min
        ).format("X");
      }
      if (!this.maxDateInMilliseconds) {
        this.maxDateInMilliseconds = this.parseStringToValidDate(
          this.max
        ).format("X");
      }

      if (this.min) {
        isLowerThanMin = dateInstance < this.minDateInMilliseconds;
      }
      if (this.max) {
        isHigherThanMax = dateInstance > this.maxDateInMilliseconds;
      }

      return isLowerThanMin || isHigherThanMax;
    },
    setManualTimeForDateRange(rangeDateIndex) {
      this.isGoingToSelectTime = true;
      this.isGoingToSelectYearAndMonth = true;
      const selectedDate = this.rangeDateArray[rangeDateIndex];
      this.selectedDateIndexForTimeSelection = rangeDateIndex;

      this.currentSelectedTime.hour = selectedDate.date[3];
      this.currentSelectedTime.minute = selectedDate.date[4];
    },
    setTimeForDate() {
      this.rangeDateArray[
        this.selectedDateIndexForTimeSelection
      ].date[3] = this.currentSelectedTime.hour;
      this.rangeDateArray[
        this.selectedDateIndexForTimeSelection
      ].date[4] = this.currentSelectedTime.minute;

      this.isGoingToSelectTime = false;
      this.emitDateRanges();
      this.formatRangeOfDates();
    },
    timeIterator(action, type) {
      if (action === "increase") {
        if (type === "hour") {
          if (this.currentSelectedTime.hour === 23) {
            this.currentSelectedTime.hour = 0;
          } else {
            this.currentSelectedTime.hour++;
          }
        } else if (type === "minute") {
          if (this.currentSelectedTime.minute === 59) {
            this.currentSelectedTime.minute = 0;
          } else {
            this.currentSelectedTime.minute++;
          }
        }
      } else if (action === "decrease") {
        if (type === "hour") {
          if (this.currentSelectedTime.hour === 0) {
            this.currentSelectedTime.hour = 23;
          } else {
            this.currentSelectedTime.hour--;
          }
        } else if (type === "minute") {
          if (this.currentSelectedTime.minute === 0) {
            this.currentSelectedTime.minute = 59;
          } else {
            this.currentSelectedTime.minute--;
          }
        }
      }
    },
    generateYearSelectionArray(type = "+") {
      if (this.isGoingToSelectYearAndMonth.type === "month") {
        return;
      }

      let year = this.yearSelectionArray[0] || this.currentMonthArray[0];

      if (type === "-") {
        year -= 16;
      } else if (type === "+") {
        year += 16;
      }

      this.yearSelectionArray = [];
      year--;
      for (let i = 0; i <= 15; i++) {
        year++;
        this.yearSelectionArray.push(year);
      }
    },
    yearItemSelected(year) {
      this.monthYearSelectionArray[0] = year;
      this.isGoingToSelectYearAndMonth.type = "month";
    },
    monthItemSelected(month) {
      this.monthYearSelectionArray[1] = month.id;
      this.isGoingToSelectYearAndMonth = { active: false, type: "year" };
      this.populateAndRenderMonthsArray(this.monthYearSelectionArray);
      this.monthYearSelectionArray = [];
    },
    goToDefaultCalendar() {
      this.isGoingToSelectTime = false;
      this.isGoingToSelectYearAndMonth.active = false;
      this.monthYearSelectionArray = [];
    },
    backToYearSelection() {
      this.isGoingToSelectYearAndMonth.type = "year";
      this.monthYearSelectionArray = [];
    }
  },
  computed: {
    firstDayOfFirstMonthInWeek: function() {
      return (
        parseInt(
          this.datetimePickerObj.monthsArray.firstMonth.days[0].dayOfWeek
        ) - 1
      );
    },
    firstDayOfSecondMonthInWeek: function() {
      return (
        parseInt(
          this.datetimePickerObj.monthsArray.secondMonth.days[0].dayOfWeek
        ) - 1
      );
    },
    theme: function() {
      return {
        "--main-color": this.themeColor,
        "--secondary-color": this.themeColor + "B3",
        "--hover-color": this.themeColor + "80"
      };
    },
    isConfirmButtonActive: function() {
      if (this.range) {
        if (this.rangeDateArray.length !== 2) {
          return false;
        }
      } else {
        if (this.selectedDateArray.length === 0) {
          return false;
        }
      }

      return true;
    }
  },
  filters: {
    prependZeroToTime: function(value) {
      value = value.toString();

      if (value.length === 2) return value;
      return "0" + value;
    }
  }
};
</script>

<style scoped lang="scss">
*,
*::after,
*::before {
  box-sizing: border-box;
  font-family: IRANSansMobileFaNum !important;

  &:hover{
    transition: .2s;
  }

}


*::selection {
  background-color: transparent;
  color: inherit;
}

@font-face {
  font-family: "IranSans";
  src: url("../assets/font/IRANSans.ttf") format("truetype");
}

@font-face {
  font-family: "IRANSansMobileFaNum";
  src: url("../assets/font/IRANSansMobileFaNum.ttf") format("truetype");
}

.disabled {
  opacity: 0.3;
  pointer-events: none;
}

.mnx-dtp {
  font-family: IranSans;
  transition: 0.3s;
  direction: rtl;

  .mnx-dtp-input {
  }
  .mnx-dtp-container {
    position: fixed;
    width: 330px;
    height: auto;
    background-color: white;
    z-index: 10001;
    left: 50%;
    top: 100px;
    transform: translateX(-50%);

    .double-month-container,
    .single-month-container {
      div {
        max-width: 377px;
      }
    }

    &.range-is-enabled {
      width: auto;
    }

    .mnx-dtp-header {
      color: #fff;
      padding: 20px 20px;
      background-color: var(--main-color);
      font-size: 25px;

      &.range-header {
        display: flex;
        justify-content: space-between;

        .header-options {
          width: 30%;
        }

        .month-container {
          font-size: 20px;
          text-align: right;

          &:nth-child(1) {
            padding-bottom: 15px;
          }

          span {
            font-size: 12px;
            margin-right: 10px;
            border: 1px solid white;
            border-radius: 5px;
            padding: 5px 5px 2px 5px;
            cursor: pointer;
            transition: 0.3s;
            display: inline-block;

            &:hover {
              background-color: rgba(255, 255, 255, 0.13);
            }
          }
        }
        .year-container {
        }
      }

      .year-container {
        padding-bottom: 15px;
      }
      .month-container {
      }
    }

    .mnx-dtp-month-selection {
      width: 100%;
      display: flex;
      justify-content: space-between;
      height: 40px;
      align-items: center;
      padding: 14px 14px;
      margin-bottom: 5px;

      div {
        cursor: pointer;
        color: #3c4858;

        span {
          background-image: url("../assets/img/arrow-right.png");
          display: inline-block;
          width: 20px;
          height: 100%;
          background-size: contain;
          background-repeat: no-repeat;
          opacity: 0.7;
        }
      }

      .prev-month {
        height: 100%;
        width: 30px;
        display: flex;
        justify-content: flex-start;
      }
      .next-month {
        height: 100%;
        width: 30px;
        display: flex;
        justify-content: flex-end;

        span {
          transform: rotate(180deg);
        }
      }
      .current-month {
      }
    }

    .days-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      padding: 0 14px 0 14px;

      .day {
        width: 14.285%;
        height: 40px;
        text-align: center;
        line-height: 40px;
        margin-bottom: 10px;
        padding: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        border-radius: 30px;

        &.selected-date {
          color: white;
          background-color: var(--main-color);
          border-radius: 30px;
        }

        &.selected-in-range {
          border-radius: 0;

          &.today {
            border-radius: 0;
          }

          &.is-first-day {
            background-color: var(--secondary-color);
            border-radius: 0 30px 30px 0;

            &:hover {
              border-radius: 0 30px 30px 0;
            }
          }
          &.is-last-day {
            background-color: var(--secondary-color);
            border-radius: 30px 0 0 30px;

            &:hover {
              border-radius: 30px 0 0 30px;
            }
          }
          &.is-first-day.is-last-day {
            border-radius: 30px;
          }

          color: black;
          background-color: var(--hover-color);

          &:hover {
            background-color: var(--secondary-color);
            border-radius: 0;
          }
        }

        .day-cell {
          /*background-color: #0a6ebd;*/
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          color: black;
          padding-top: 6px;

          &.selected-date {
            color: white;
            background-color: var(--main-color);
          }

          &.selected-in-range {
            color: black;
            background-color: var(--hover-color);
            border: 2px solid var(--main-color);
          }
        }

        &.mock-day {
          background-color: transparent;
          cursor: auto;

          &:hover {
            background-color: transparent;
          }
        }

        &.day-disabled {
          pointer-events: none;
          opacity: 0.3;
        }

        &.today {
          border: 1px solid var(--main-color);
          border-radius: 30px;
        }

        &:hover {
          color: white;
          background-color: var(--hover-color);
          border-radius: 30px;
        }
      }
    }
    .days-of-week-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      font-size: 12px;
      padding: 0 14px 0 14px;
      line-height: 20px;
      color: #b9b9b9;
      margin-bottom: 20px;
      height: 20px;

      .days-of-week {
        width: 14.285%;
        text-align: center;
      }
    }

    .double-month-container {
      display: flex;
      & > div {
      }
    }

    .close-btn {
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid var(--main-color);
      color: var(--main-color);
      text-align: center;
      line-height: 36px;
      left: 10px;
      top: 10px;
      opacity: 0.5;
      transition: 0.3s;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }

    .time-picker-container {
      position: relative;
      width: 100%;
      height: 385px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .time-selection-container {
        display: flex;
        flex-direction: row;

        .minute-container,
        .hour-container {
          display: flex;
          align-items: center;
          flex-direction: column;

          .top-arrow,
          .bottom-arrow {
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 25px;
            line-height: 50px;
            cursor: pointer;
            background-image: url("../assets/img/arrow-right.png");
            background-size: contain;
            width: 30px;
            background-repeat: no-repeat;
            background-position: center;

            &::selection {
              background-color: transparent;
              color: inherit;
            }
          }

          .top-arrow {
            transform: rotate(-90deg);
          }
          .bottom-arrow {
            transform: rotate(90deg);
          }

          .time-shower {
            height: 120px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 80px;
            width: 80px;
            border-radius: 10px;
            padding-top: 40px;
          }
        }

        .minute-container {
        }
        .two-dots {
          display: flex;
          align-items: center;
          font-size: 80px;
          width: 80px;
          justify-content: center;
          padding-top: 30px;
        }
        .hour-container {
        }
      }
      .confirm-button-container {
        padding-top: 20px;

        .confirm {
          font-size: 18px;
          margin-right: 10px;
          border: 1px solid var(--main-color);
          color: var(--main-color);
          border-radius: 5px;
          padding: 15px 10px 10px 10px;
          cursor: pointer;
          -webkit-transition: 0.3s;
          transition: 0.3s;
          background-color: white;
          width: 70px;
        }
        .cancel {
          color: var(--main-color);
          font-size: 18px;
          margin-right: 10px;
          border: 1px solid var(--main-color);
          background-color: white;
          border-radius: 5px;
          padding: 15px 10px 10px 10px;
          cursor: pointer;
          -webkit-transition: 0.3s;
          transition: 0.3s;
          width: 70px;
        }

        button:hover {
          color: #fff;
          background-color: var(--main-color);
          outline: none;
        }
      }
    }

    .year-month-selection-wrapper {
      width: 100%;
      position: relative;
      padding-top: 36px;

      .year-month-navigation-bar {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 40px;
        align-items: center;
        padding: 14px 14px;
        margin-bottom: 5px;

        div {
          cursor: pointer;
          color: #3c4858;

          span {
            background-image: url("../assets/img/arrow-right.png");
            display: inline-block;
            width: 20px;
            height: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            opacity: 0.7;
          }
        }

        .prev-month {
          height: 100%;
          width: 30px;
          display: flex;
          justify-content: flex-start;
        }
        .next-month {
          height: 100%;
          width: 30px;
          display: flex;
          justify-content: flex-end;

          span {
            transform: rotate(180deg);
          }
        }
        .current-month {
        }
      }
      .year-selection-wrapper {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        padding: 10px 15px;

        .year {
          width: 23%;
          height: 50px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          margin-right: 10px;
          border-radius: 5px;
          padding: 7px 5px 2px 5px;
          cursor: pointer;
          -webkit-transition: 0.3s;
          transition: 0.3s;
          border: 1px solid var(--main-color);

          &.current-active-year {
            border: 4px double var(--main-color);
          }

          &:hover {
            background-color: var(--main-color);
            color: white;
          }
        }
      }
      .month-selection-wrapper {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
        align-items: center;
        padding: 10px 15px;

        .month {
          width: 23%;
          height: 50px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          margin-right: 10px;
          border-radius: 5px;
          padding: 7px 5px 2px 5px;
          cursor: pointer;
          -webkit-transition: 0.3s;
          transition: 0.3s;
          border: 1px solid var(--main-color);

          &:hover {
            background-color: var(--main-color);
            color: white;
          }
        }
      }
    }

    .action-bar-container{
      display: flex;
      justify-content: flex-start;
      padding: 16px;
      button {
        border: 1px solid var(--main-color);
        color: var(--main-color);
        background-color: transparent;
        font-size: 16px;
        margin-right: 10px;
        border-radius: 5px;
        font-weight: bold;
        cursor: pointer;
        -webkit-transition: 0.3s;
        transition: 0.3s;
        display: inline-block;
        line-height: 25px;
        height: 45px;
        min-width: 80px;
        padding: 12px 8px 8px;

        &:hover{
          background-color: var(--main-color);
          color: white;
        }
      }
    }
  }
  .mnx-dtp-mask {
    position: fixed;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10000;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
  }
}


/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 768px) {
  .mnx-dtp {
    .mnx-dtp-container {
      top: 50px;

      &.range-is-enabled {
        width: calc(100% - 30px);
        max-width: 378px;
      }

      .double-month-container {
        .second-month {
          display: none;
        }
      }

      .mnx-dtp-header.range-header {
        .month-container {
          span.time-picker-button{
            margin-right: 0;
            display: block;
            width: 108px;
          }
        }
      }

      .year-month-selection-wrapper{

        .year-selection-wrapper{

          .year{
            margin-right: 0px;
            margin-bottom: 8px;
          }

        }

        .month-selection-wrapper{

          .month{
            margin-right: 0px;
            margin-bottom: 8px;
          }
        }
      }

    }
  }
}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
  .mnx-dtp {
    .mnx-dtp-container {

      &.range-is-enabled {
        width: calc(100% - 30px);
        max-width: 754px;
      }
    }
  }
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {

}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>
