export default Ext.define('SYNOCOMMUNITY.RRManager.Addons.Main', {
  extend: 'SYNO.ux.GridPanel',
  helper: SYNOCOMMUNITY.RRManager.Helper,
  itemsPerPage: 1e3,
  constructor: function (e) {
    this.appWin = e.appWin;
    const self = this;
    Ext.apply(self, e);
    let config = self.fillConfig(e);
    self.itemsPerPage =
      self.appWin.appInstance.getUserSettings(self.itemId + '-dsPageLimit') || self.itemsPerPage;
    self.callParent([config]);
    self.mon(
      self,
      'resize',
      (e, width, height) => {
        self.updateFbarItems(width);
      },
      self
    );
  },
  getPageRecordStore: function () {
    return new Ext.data.SimpleStore({
      fields: ['value', 'display'],
      data: [
        [100, 100],
        [500, 500],
        [1e3, 1e3],
        [3e3, 3e3],
      ],
    });
  },
  getCategoryStore: function () {
    return new Ext.data.SimpleStore({
      fields: ['value', 'display'],
      data: [
        ['', this.helper.V('ui', 'addons_all')],
        ['system', this.helper.V('ui', 'addons_system')],
      ],
    });
  },
  onChangeDisplayRecord: function (e, t, i) {
    const self = this,
      addonsStore = self.addonsStore;
    const newItemsPerPage = e.getValue();
    if (self.itemsPerPage !== newItemsPerPage) {
      self.itemsPerPage = newItemsPerPage;
      self.paging.pageSize = self.itemsPerPage;
      addonsStore.load({ params: { offset: 0, limit: self.itemsPerPage } });
      self.appWin.appInstance.setUserSettings(self.itemId + '-dsPageLimit', self.itemsPerPage);
    }
  },
  onChangeCategory: function (e, t, i) {
    const s = this,
      n = s.addonsStore,
      a = e.getValue();
    a !== n.baseParams.category && (Ext.apply(n.baseParams, { category: a }), s.loadData());
  },
  initPageComboBox: function (e) {
    return new SYNO.ux.ComboBox({
      name: 'page_rec',
      hiddenName: 'page_rec',
      hiddenId: Ext.id(),
      store: e,
      displayField: 'display',
      valueField: 'value',
      triggerAction: 'all',
      value: this.itemsPerPage,
      editable: !1,
      width: 72,
      mode: 'local',
      listeners: { select: { fn: this.onChangeDisplayRecord, scope: this } },
    });
  },
  initCategoryComboBox: function (e) {
    return new SYNO.ux.ComboBox({
      name: 'category',
      store: e,
      displayField: 'display',
      valueField: 'value',
      value: '',
      width: 120,
      mode: 'local',
      listeners: { select: { fn: this.onChangeCategory, scope: this } },
    });
  },
  initPagingToolbar: function () {
    return new SYNO.ux.PagingToolbar({
      store: this.addonsStore,
      displayInfo: !0,
      pageSize: this.itemsPerPage,
      showRefreshBtn: !0,
      cls: 'iscsi-log-toolbar',
      items: [
        {
          xtype: 'tbtext',
          style: 'padding-right: 4px',
          text: 'Items per page',
        },
        this.initPageComboBox(this.getPageRecordStore()),
      ],
    });
  },
  initSearchForm: function () {
    // return new SYNO.SDS.iSCSI.SearchFormPanel({
    //     cls: "iscsi-search-panel",
    //     renderTo: Ext.getBody(),
    //     shadow: !1,
    //     hidden: !0,
    //     owner: this,
    // });
  },
  initToolbar: function () {
    const e = this,
      t = new SYNO.ux.Toolbar();
    return (
      // (e.clearButton = new SYNO.ux.Button({
      //     xtype: "syno_button",
      //     text: "Clear",
      //     handler: e.onLogClear,
      //     scope: e,
      // })),
      (e.saveButton = new SYNO.ux.Button({
        xtype: 'syno_button',
        text: e.helper.V('ui', 'save_addons_btn'),
        handler: e.onAddonsSave,
        btnStyle: 'blue',
        scope: e,
      })),
      (e.searchField = new SYNOCOMMUNITY.RRManager.AdvancedSearchField({
        iconStyle: 'filter',
        owner: e,
      })),
      (e.searchField.searchPanel = e.searchPanel),
      // t.add(e.clearButton),
      t.add(e.saveButton),
      t.add('->'),
      t.add(e.initCategoryComboBox(e.getCategoryStore())),
      t.add({ xtype: 'tbspacer', width: 4 }),
      t.add(e.searchField),
      t
    );
    // return [];
  },
  initEvents: function () {
    // this.mon(this.searchPanel, "search", this.onSearch, this),
    this.mon(this, 'activate', this.onActive, this);
  },
  _getLng: function (lng) {
    const localeMapping = {
      dan: 'da_DK', // Danish in Denmark
      ger: 'de_DE', // German in Germany
      enu: 'en_US', // English (United States)
      spn: 'es_ES', // Spanish (Spain)
      fre: 'fr_FR', // French in France
      ita: 'it_IT', // Italian in Italy
      hun: 'hu_HU', // Hungarian in Hungary
      nld: 'nl_NL', // Dutch in The Netherlands
      nor: 'no_NO', // Norwegian in Norway
      plk: 'pl_PL', // Polish in Poland
      ptg: 'pt_PT', // European Portuguese
      ptb: 'pt_BR', // Brazilian Portuguese
      sve: 'sv_SE', // Swedish in Sweden
      trk: 'tr_TR', // Turkish in Turkey
      csy: 'cs_CZ', // Czech in Czech Republic
      gre: 'el_GR', // Greek in Greece
      ukr: 'uk-UA',
      rus: 'ru-RU', // Russian in Russia
      heb: 'he_IL', // Hebrew in Israel
      ara: 'ar_SA', // Arabic in Saudi Arabia
      tha: 'th_TH', // Thai in Thailand
      jpn: 'ja_JP', // Japanese in Japan
      chs: 'zh_CN', // Simplified Chinese in China
      cht: 'zh_TW', // Traditional Chinese in Taiwan
      krn: 'ko_KR', // Korean in Korea
      vi: 'vi-VN', // Vietnam in Vietnam
    };
    return Object.keys(localeMapping).indexOf(lng) > -1 ? localeMapping[lng] : localeMapping['enu'];
  },
  getStore: function () {
    var gridStore = new SYNO.API.JsonStore({
      autoDestroy: true,
      appWindow: this.appWin,
      restful: true,
      root: 'result',
      url: '/webman/3rdparty/rr-manager/scripts/getAddons.cgi',
      idProperty: 'name',
      fields: [
        {
          name: 'name',
          type: 'string',
        },
        {
          name: 'version',
          type: 'string',
        },
        {
          name: 'description',
          type: 'object',
        },
        {
          name: 'system',
          type: 'boolean',
        },
        {
          name: 'installed',
          type: 'boolean',
        },
      ],
      listeners: {
        exception: this.loadException,
        beforeload: this.onBeforeStoreLoad,
        load: this.onAfterStoreLoad,
        scope: this,
      },
    });
    return gridStore;
  },
  getColumnModel: function () {
    var currentLngCode = this._getLng(SYNO?.SDS?.Session?.lang || 'enu');
    this.Col1 = new SYNO.ux.EnableColumn({
      header: this.helper.V('ui', 'col_system'),
      dataIndex: 'system',
      id: 'system',
      name: 'system',
      width: 100,
      align: 'center',
      enableFastSelectAll: false,
      disabled: true,
      bindRowClick: true,
    });
    this.Col2 = new SYNO.ux.EnableColumn({
      header: this.helper.V('ui', 'col_installed'),
      dataIndex: 'installed',
      name: 'installed',
      id: 'installed',
      width: 100,
      align: 'center',
      enableFastSelectAll: false,
      disabled: true,
      bindRowClick: true,
    });

    return new Ext.grid.ColumnModel({
      columns: [
        {
          header: this.helper.V('ui', 'col_name'),
          width: 60,
          dataIndex: 'name',
        },
        {
          header: this.helper.V('ui', 'col_version'),
          width: 30,
          dataIndex: 'version',
        },
        {
          header: this.helper.V('ui', 'col_description'),
          width: 300,
          dataIndex: 'description',
          renderer: function (value, metaData, record, row, col, store, gridView) {
            return value[currentLngCode] ?? value['en_US'];
          },
        },
        this.Col1,
        this.Col2,
      ],
      defaults: { sortable: !1, menuDisabled: !1 },
    });
  },
  fillConfig: function (e) {
    const t = this;
    // (t.searchPanel = t.initSearchForm()),
    (t.addonsStore = t.getStore()), (t.paging = t.initPagingToolbar());
    const i = {
      border: !1,
      trackResetOnLoad: !0,
      layout: 'fit',
      itemId: 'iscsi_log',
      tbar: t.initToolbar(),
      enableColumnMove: !1,
      enableHdMenu: !1,
      bbar: t.paging,
      store: t.addonsStore,
      colModel: t.getColumnModel(),
      view: new SYNO.ux.FleXcroll.grid.BufferView({
        rowHeight: 27,
        scrollDelay: 30,
        borderHeight: 1,
        emptyText: 'no_log_available',
        templates: {
          cell: new Ext.XTemplate(
            '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css}" style="{style}" tabIndex="-1" {cellAttr}>',
            '<div class="{this.selectableCls} x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div>',
            '</td>',
            { selectableCls: SYNO.SDS.Utils.SelectableCLS }
          ),
        },
      }),
      plugins: [this.Col1, this.Col2],
      selModel: new Ext.grid.RowSelectionModel({
        singleSelect: false,
      }),
      loadMask: !0,
      stripeRows: !0,
      listeners: {
        cellclick: {
          delay: 100,
          scope: this,
          fn: this.onCellClick,
        },
      },
    };
    return Ext.apply(i, e), i;
  },
  onCellClick: function (grid, recordIndex, i, s) {
    var record = grid.store.data.get(recordIndex);
    var id = grid.getColumnModel().getColumnAt(i).id;
    if (id !== 'system' && record.data['system'] === false) {
      record.data[id] = !record.data[id];
      grid.getView().refresh();
    }
  },
  isBelong: function (e, t) {
    let i;
    for (i in t) {
      if (t[i] !== e[i]) {
        return !1;
      }
    }
    return !0;
  },
  isTheSame: function (e, t) {
    return this.isBelong(e, t) && this.isBelong(t, e);
  },
  onSearch: function (e, t) {
    const i = this,
      s = i.addonsStore;
    if (!i.isTheSame(s.baseParams, t)) {
      const e = ['name', 'description'];
      if (
        (t.date_from &&
          (t.date_from = Date.parseDate(t.date_from, SYNO.SDS.DateTimeUtils.GetDateFormat()) / 1e3),
        t.date_to)
      ) {
        const e = Date.parseDate(t.date_to, SYNO.SDS.DateTimeUtils.GetDateFormat());
        e.setDate(e.getDate() + 1), (t.date_to = e / 1e3 - 1);
      }
      e.forEach(e => {
        s.baseParams[e] = t[e];
      }),
        i.loadData();
    }
    i.searchField.searchPanel.hide();
  },
  onActive: function () {
    if (this.loaded) {
      return;
    }
    this.loadData();
  },
  enableButtonCheck: function () {
    this.addonsStore.getTotalCount() ? this.saveButton.enable() : this.saveButton.disable();
  },
  loadData: function () {
    const e = this.addonsStore;
    const t = { offset: 0, limit: this.itemsPerPage };
    e.load({ params: t });
    this.enableButtonCheck();
    this.loaded = true;
  },
  loadException: function () {
    this.appWin.clearStatusBusy(), this.setMask(!0);
  },
  onBeforeStoreLoad: function (e, t) {
    this.appWin.setStatusBusy();
  },
  onAfterStoreLoad: function (e, t, i) {
    const s = this;
    s.appWin.clearStatusBusy(),
      t.length < 1 ? s.setMask(!0) : s.setMask(!1),
      s.setPagingToolbar(e, s.paging),
      this.enableButtonCheck();
  },
  setMask: function (e) {
    SYNOCOMMUNITY.RRManager.SetEmptyIcon(this, e);
  },
  setPagingToolbar: function (e, t) {
    this.setPagingToolbarVisible(t, e.getTotalCount() > this.itemsPerPage);
  },
  setPagingToolbarVisible: function (e, t) {
    e.setButtonsVisible(!0);
  },
  updateFbarItems: function (e) {
    this.isVisible();
  },
  showMsg: function (msg) {
    this.owner.getMsgBox().alert('title', msg);
  },
  onClearLogDone: function (e, t, i, s) {
    e ? this.loadData() : this.appWin.getMsgBox().alert(this.appWin.title, 'error_system'),
      this.appWin.clearStatusBusy();
  },
  onAddonsSave: function (e) {
    var installedAddons = this.addonsStore
      .getRange()
      .filter(x => {
        return x.data.installed === true;
      })
      .map(x => {
        return x.id;
      });
    var newAddons = {};
    installedAddons.forEach(x => {
      newAddons[x] = '';
    });
    var rrConfigJson = localStorage.getItem('rrConfig');
    var rrConfig = JSON.parse(rrConfigJson);
    rrConfig.user_config.addons = newAddons;
    this.appWin.setStatusBusy();
    this.appWin.handleFileUpload(rrConfig.user_config);
  },
  onLogClear: function () {},
  onExportCSV: function () {
    this.onLogSave('csv');
  },
  onExportHtml: function () {
    this.onLogSave('html');
  },
  onLogSave: function (e) {},
  saveLog: function (e) {},
  destroy: function () {
    this.rowNav && (Ext.destroy(this.rowNav), (this.rowNav = null)),
      this.searchField && this.searchField.fireEvent('destroy'),
      this.callParent([this]);
  },
});
