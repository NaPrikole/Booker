<template>
  <div>
    <div class="top-header">Here will be header</div>
    <div id="boardroom-count">
      <h2 class="boardroom">BOARDROOM 1</h2>
      <h2 class="boardroom">BOARDROOM 2</h2>
      <h2 class="boardroom">BOARDROOM 3</h2>
    </div>
    <div id="header">
      <div>
        <img src="../assets/logo.png">
        <h1>BOOKER</h1>
      </div>
      <div>
        <button class="add-employee">Add Employee</button>
      </div>
      <div>
        <current-month></current-month>
      </div>
    </div>
    <div id="day-bar">
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
      <div>Sun</div>
    </div>
    <div id="calendar">
      <div class="calendar-week" v-for="(week, i) in weeks"  :key="i" :week="week">
          <calendar-day v-for="(day, i) in week" :key="i" :day="day"></calendar-day>
      </div>
    </div>
    <event-form></event-form>
    <div class="top-header">Here will be footer</div>
  </div>
</template>
<script>
    import CalendarDay from './CalendarDay.vue';
    import CurrentMonth from './CurrentMonth.vue';
    import EventForm from './EventForm.vue';

    export default {
        computed: {
          year() {
            return this.$store.state.currentYear;
          },
          month() {
            return this.$store.state.currentMonth;
          },
          days() {
            //Generating all days in current month
            let days = [];
            let currentDay = this.$moment(`${this.year}-${this.month}-1`, 'YYYY-M-D');
            do{
              days.push(currentDay);
              currentDay = this.$moment(currentDay).add(1, 'days');
            } while ((currentDay.month() + 1) === this.month);
            //Add previous days to start
            currentDay = this.$moment(days[0]);

            const SUNDAY = 0;
            const MONDAY = 1;

            if(currentDay.day() !== MONDAY) {
              do{
                currentDay = this.$moment(currentDay).subtract(1, 'days');
                days.unshift(currentDay);
              } while(currentDay.day() !== MONDAY);
            }

            //Add folowing days to end
            currentDay = this.$moment(days[days.length - 1]);
            if(currentDay.day() !== SUNDAY) {
              do {
                currentDay = this.$moment(currentDay).add(1, 'days');
                days.push(currentDay);
              } while(currentDay.day() !== SUNDAY);
            }
            return days;
          },
          weeks() {
            let weeks = [];
            let week = [];

            for(let day of this.days) {
              week.push(day);
              if(week.length === 7) {
                weeks.push(week);
                week = [];
              }
            }
            return weeks;
          }
        },
        components: {
          CalendarDay,
          CurrentMonth,
          EventForm,
        }
    }
</script>
