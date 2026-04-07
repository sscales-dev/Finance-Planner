// Date classes for database documents

class BudgetSpan {
    constructor(startDate, duration, date_created) {
        this.status = "active";
        this.label = "current";
        this.start = {
            "$date": startDate
        };
        this.duration = {
            "$numberDecimal": duration
        };
        this.last_updated = {
            "$date": Date.now()
        };
        this.date_created = {
            "$date": Date.now()
        }
    }
};

class Paydate {
  constructor(parentBudgetSpanUUID, position, value, frequency, dayCount) {
    this.parent = parentBudgetSpanUUID;
    this.position = position;
    this.value = {
        "$date": value
    };
    this.frequency = {
        "value": frequency,
        "day_count": dayCount
    };
    this.date_updated = {
        "$date": Date.now()
    }
    this.date_created = {
        "$date": Date.now()
    }
  }
};