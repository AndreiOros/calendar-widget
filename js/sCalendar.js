var sCalendar = (function(){

    const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const MONTHS = [ ['Jan', 31], ['Feb', 28, 29], ['Mar', 31], 
                     ['Apr', 30], ['May', 31], ['Jun', 30], 
                     ['Jul', 31], ['Aug', 31], ['Sep', 30], 
                     ['Oct', 31], ['Nov', 30], ['Dec', 31] ];

    const TODAY = new Date();
    const TODAY_INFO = [TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate()];

    const CLASS = {
     //======================================//
        'container'      :   'sCal_container'         ,
        'header'        :   'sCal_header'       ,
        'button'        :   'sCal_button'       ,
        'next'          :   'sCal_next'         ,
        'prev'          :   'sCal_prev'         ,
        'label'         :   'sCal_label'        ,
        'days'          :   'sCal_days'         ,
        'dates'         :   'sCal_dates'        ,
        'row'           :   'sCal_row'          ,
        'normal'        :   'sCal_normal'       ,
        'today'         :   'sCal_today'        ,
        'other'         :   'sCal_other'        ,
        'selected'      :   'sCal_selected'     ,
        'unusable'      :   'sCal_unusable'     
     //======================================//
    }

    const ROWS = 6;
    const COLS = 7;


    function sCalendar(parent){
        this.container = sQ(parent);
        this.buildHeader().buildBody();
    }
    
    sCalendar.prototype.components = {
        
    }

    sCalendar.isLeap = function(year, month){
        if(month !== 1){
            return 1;
        }
        
        if(year % 4 === 0){
            if(year % 100 === 0){
                if(year % 400 === 0){
                    return 2;
                }
                else {
                    return 1;
                }
            }
            else {
                return 2;
            }
        }
        else {
            return 1;
        }
    }

    sCalendar.info = function(date){
        return [
            date.getFullYear(),
            date.getMonth(),
            MONTHS[month][isLeap(year, month)],
            new Date(year, month, 1).getDay()
        ];
    }

    sCalendar.comp = function(l, r){
        if(l[0] === r[0]){
            if(l[1] === r[1]){
                if(l[2] < r[2]){
                    return -1
                }
                else if(l[2] > r[2]){
                    return 1;
                }
                else{
                    return 0;
                }
            }
            else if(l[1] < r[1]){
                return -1;
            }
            else{
                return 1;
            }
        }
        else if(l[0] < r[0]){
            return -1;
        }
        else{
            return 1;
        }

        return 2;
    }

    sCalendar.isIn = function(date, interval){
        if(interval[0] === null || interval[1] === null){
            return false;
        }

        let c1 = (comp(date, interval[0]) === 1 || comp(date, interval[0]) === 0);
        let c2 = (comp(date, interval[1]) === -1 || comp(date, interval[1]) === 0);

        return (c1 && c2);
    }

    sCalendar.prototype.buildHeader = function(){
        this.container
            .addClass(CLASS.container)
            .createChild('div', {'class' : CLASS.header}, 0)
            .children()
            .createChild('div', {'class' : CLASS.button + ' ' + CLASS.prev})
            .createChild('div', {'class' : CLASS.label}, 0, 'Jul 2018')
            .createChild('div', {'class' : CLASS.button + ' ' + CLASS.next});
        
        let days_container = this.container.createChild('div', {'class' : CLASS.days})
            .children().last();

        DAYS.forEach(function(day){
            days_container.createChild('div', null, 0, day)
        });
        
        sQ('.' + CLASS.button + '.' + CLASS.prev).each(function(el){
            el.e(0).innerHTML = '&#8249;';
        });
        sQ('.' + CLASS.button + '.' + CLASS.next).each(function(el){
            el.e(0).innerHTML = '&#8250;';
        });

        return this;
    }

    sCalendar.prototype.buildBody = function(){
        this.container.createChild('div', {'class' : CLASS.dates});
        let dates_container = this.container.children().last();

        for(let i = 0; i < ROWS; i++){
            dates_container.createChild('div', {'class' : CLASS.row});
        }

        let dates_rows = dates_container.children().each(function(el){
            for(let i = 0; i < COLS; i++){
                el.createChild('div', {'class' : CLASS.normal});
            }
        });

        return this;
    }
    
    sCalendar.prototype.updateLabel = function(date){
        
    }
    
    sCalendar.prototype.buildDatesArray = function(){
        
    }

    return sCalendar;
    
})();


document.addEventListener('DOMContentLoaded', function(){
    var a = new sCalendar('#calendar');
})