sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/viz/ui5/api/env/Format",
	"sap/ui/model/json/JSONModel",
	"sap/viz/ui5/format/ChartFormatter",
	'sap/ui/unified/ColorPickerPopover',
	'sap/ui/unified/library',
	'sap/ui/core/library',
	'sap/m/MessageToast'
], function (Controller, Format, JSONModel, ChartFormatter, ColorPickerPopover, unifiedLibrary, coreLibrary, MessageToast) {
	"use strict";
	var ColorPickerMode = unifiedLibrary.ColorPickerMode,
		ValueState = coreLibrary.ValueState;
	return Controller.extend("com.airdit.DashboardPrototype.controller.App", {
		onInit: function () {
			this.getView().setModel(new sap.ui.model.json.JSONModel({
				"milk": [{
					"Seasons": "Spring",
					"Revenue": 325020.45,
					"Cost": 197234.4
				}, {
					"Seasons": "Summer",
					"Revenue": 464000.3,
					"Cost": 232070.5
				}, {
					"Seasons": "Autumn",
					"Revenue": 479100.17,
					"Cost": 231003.32
				}, {
					"Seasons": "Winter",
					"Revenue": 536110.34,
					"Cost": 371122.45
				}]
			}));
			Format.numericFormatter(ChartFormatter.getInstance());
			var formatPattern = ChartFormatter.DefaultPattern;
			this.byId("idVizFrame").setVizProperties({
				title: {
					visible: false,
					text: "Dashboard",
					style: {
						fontWeight: 'normal'
					}
				},
				interaction: {
					selectability: {
						mode: "EXCLUSIVE"
					}
				},
				plotArea: {
					dataLabel: {
						formatString: formatPattern.SHORTFLOAT_MFD2,
						visible: true,
						showTotal: true
					},
					colorPalette: ["#0091D5", "#EA6A47"],
					dataPointSize: {
						min: 5
					}
				},
				valueAxis: {
					label: {
						formatString: formatPattern.SHORTFLOAT
					},
					title: {
						text: 'Revenue & Cost'
					}
				},
				categoryAxis: {
					title: {
						text: 'Seasons'
					},
					label: {
						rotation: "fixed",
						angle: 0,
						style: {
							fontSize: "12px",
							color: '#5496cd',
							fontWeight: '700'
						},
						parentStyle: {
							fontSize: "15px",

							fontWeight: '700'
						}
					},
					axisTick: {
						shortTickVisible: true
					}
				}
			});
		},
		openDefaultModeSample: function (oEvent) {
			this.input = oEvent.getSource();
			if (!this.oColorPickerPopover) {
				this.oColorPickerPopover = new ColorPickerPopover("oColorPickerPopover", {
					colorString: "blue",
					mode: ColorPickerMode.HEX,
					change: this.handleChange.bind(this)
				});
			}
			this.oColorPickerPopover.openBy(oEvent.getSource());
		},
		handleChange: function (oEvent) {
			this.input.setValue(oEvent.getParameter("hex"));
			this.input.setValueState(ValueState.None);
		},
		onSearch: function (oEvent) {
			var ar = [];
			for (var i = 0; i < oEvent.getParameter("selectionSet").length; i++) {
				if (oEvent.getParameter("selectionSet")[i].getRequired()) {
					if (oEvent.getParameter("selectionSet")[i].getValue() == "") {
						return MessageToast.show(oEvent.getParameter("selectionSet")[i].getName() + " color is required...");
					} else {
						ar.push(oEvent.getParameter("selectionSet")[i].getValue());
					}
				}
			}
			this.byId("idVizFrame").setVizProperties({
				plotArea: {
					colorPalette: ar
				}
			});
		}
	});
});