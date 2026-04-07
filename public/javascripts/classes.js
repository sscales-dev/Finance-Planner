class Budget {
  constructor(position, value, frequency, parent, date_created) {
    this.position = position;
    this.value = {
        "$date": value
    };
    this.frequency = {
        "value": frequency,
        "day_count": this.day_count()
    },
    this.parent = parent,
    this.date_created = {
        "$date": date_created
    }
  }
  day_count() {
        switch (this.frequency) {
            case 'weekly':
                return 7;
            case '28-day':
                return 28;
            case 'monthly':
                return 30; //insert function to calculate number of days in month
            default:
                return 0;
        }
    }
}