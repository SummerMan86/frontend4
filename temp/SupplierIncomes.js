// cubejs-server/schema/SupplierIncomes.js
cube(`SupplierIncomes`, {
  sql: `SELECT * FROM dm.supplier_incomes`,

  measures: {
    count: {
      type: `count`,
    },
    totalQuantity: {
      sql: `quantity`,
      type: `sum`,
    },
    totalRevenue: {
      sql: `totalprice`,
      type: `sum`,
    },
    avgPrice: {
      sql: `price`,
      type: `avg`,
    },
  },

  dimensions: {
    sid: {
      sql: `sid`,
      type: `number`,
    },
    nmid: {
      sql: `nmid`,
      type: `number`,
    },
    subject: {
      sql: `subject`,
      type: `string`,
    },
    barcode: {
      sql: `barcode`,
      type: `string`,
    },
    supplierArticle: {
      sql: `supplierarticle`,
      type: `string`,
    },
    techSize: {
      sql: `techsize`,
      type: `string`,
    },
    warehouseName: {
      sql: `warehousename`,
      type: `string`,
    },
    incomeId: {
      sql: `incomeid`,
      type: `number`,
    },
    date: {
      sql: `"date"`,
      type: `time`,
    },
    lastChangeDate: {
      sql: `lastchangedate`,
      type: `time`,
    },
  },
});