const moment = require("../../assets/js/momentjs/moment.js");

const app = getApp();

const task = (callback) => {
  tt.request({
    url: "http://touchsg.com/api/covid19/source/covid19apisummary",
    header: {
      "content-type": "application/json",
    },
    success(res) {
      console.log(`Request invoked successfully ${res}`);
      callback(res);
    },
    fail(res) {
      console.log(`Failed to request`);
    },
  });
};

const taskUpdate = (callback) => {
  tt.request({
    url: "http://touchsg.com/api/covid19/source/covid19apisummary/true",
    header: {
      "content-type": "application/json",
    },
    success(res) {
      console.log(`Request invoked successfully ${res}`);
      callback(res);
    },
    fail(res) {
      console.log(`Failed to request`);
    },
  });
};

const getCountries = (countries, sort) => {
  if (countries && countries.length > 0) {
    if (sort === "TotalConfirmed") {
      countries = countries.sort((a, b) => b.TotalConfirmed - a.TotalConfirmed);
    } else if (sort === "NewConfirmed") {
      countries = countries.sort((a, b) => b.NewConfirmed - a.NewConfirmed);
    } else if (sort === "NewDeaths") {
      countries = countries.sort((a, b) => b.NewDeaths - a.NewDeaths);
    } else if (sort === "TotalDeaths") {
      countries = countries.sort((a, b) => b.TotalDeaths - a.TotalDeaths);
    } else if (sort === "NewRecovered") {
      countries = countries.sort((a, b) => b.NewRecovered - a.NewRecovered);
    } else if (sort === "TotalRecovered") {
      countries = countries.sort((a, b) => b.TotalRecovered - a.TotalRecovered);
    }
  }
  return countries;
};

Page({
  data: {
    loading: true,
    summary: {},
    summaryString: "",
    global: {},
    countries: [],
    dataDate: "",
    sort: "TotalConfirmed",
    sortText: "Total Confirmed",
  },
  onLoad: function () {
    console.log("Welcome to Gadget");
    task((res) => {
      if (res && res.data) {
        let countries = res.data.Countries;
        countries = getCountries(countries, "TotalConfirmed");
        this.setData({
          loading: false,
          summary: res,
          summaryString: JSON.stringify(res),
          global: res.data.Global,
          countries,
          dataDate: moment(res.data.Date).format("YYYY-MM-DD hh:mm"),
        });
      }
    });
  },
  clickStat: function (e) {
    const sort = e.currentTarget.dataset.sort;
    const sortText = e.currentTarget.dataset.sorttext;
    let countries = this.data.countries;
    countries = getCountries(countries, sort);
    this.setData({
      countries,
      sort,
      sortText,
    });
  },
  update: function (e) {
    this.setData({
      loading: true,
    });
    taskUpdate((res) => {
      if (res && res.data) {
        let countries = res.data.Countries;
        countries = getCountries(countries, "TotalConfirmed");
        this.setData({
          loading: false,
          summary: res,
          summaryString: JSON.stringify(res),
          global: res.data.Global,
          countries,
          dataDate: moment(res.data.Date).format("YYYY-MM-DD HH:mm"),
        });
      }
    });
  },
});
