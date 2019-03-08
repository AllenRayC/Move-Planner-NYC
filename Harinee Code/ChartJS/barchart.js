// Bar chart

new Chart(document.getElementById("bar-chart"), {
    type: 'bar',
    data: {
      labels: ["200", "2001", "2002", "2003", "2004","2005","2006","2007","2008","2009","2010","2011","2012","2013","2014","2015","2016","2017"],
      datasets: [
        {
          label: "Offenses (Total)",
          backgroundColor: ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#c45850","#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#c45850"],
          data: [184652,162908,154809,147069,142093,135475,128682,121009,117956,106730,105115,106669,111147,111335,106722,105453,101716,96658]
        }
      ]
    },
    options: {
      legend: { display: false },
      title: {
        display: true,
        text: 'Total Seven Major Felony Offenses By Year'
      }
    }
}); 