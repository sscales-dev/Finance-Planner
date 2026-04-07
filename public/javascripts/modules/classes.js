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

// Transaction classes for database documents

class RecurringDateInfo {
    constructor(startDate, duration, renewalDate, renewalMonth, nextReview) {
        this.start_date = startDate;
        this.duration = duration;
        this.renewal_date = renewalDate;
        this.renewal_month = renewalMonth;
        this.next_review = nextReview;
    }
};

class OnetimeDateInfo {
    constructor(plannedDate, deadline, deadlineRequired) {     
        this.planned_date = plannedDate;
        this.deadline = deadline;
        this.deadline_required = deadlineRequired;
    }
};

class Transaction {
    constructor(name, link, amount, direction, frequency, category, dateInfoObject, include) {
        this.label = name;
        this.url = link;
        this.amount = {
            "$numberDecimal": amount
        };
        this.payment_direction = direction;
        this.payment_frequency = frequency;
        this.category = category;
        this.date_info = dateInfoObject;
        this.include = include;
        this.last_updated = {
            "$date": Date.now()
        };
        this.date_created = {
            "$date": Date.now()
        } 
    }
};

export { BudgetSpan, Paydate, RecurringDateInfo, OnetimeDateInfo, Transaction };