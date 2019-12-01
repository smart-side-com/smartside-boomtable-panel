System.register(["app/core/time_series2", "lodash", "./index", "./BoomSeriesUtils", "./../GrafanaUtils"], function (exports_1, context_1) {
    "use strict";
    var time_series2_1, lodash_1, index_1, BoomSeriesUtils_1, GrafanaUtils_1, BoomSeries;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (time_series2_1_1) {
                time_series2_1 = time_series2_1_1;
            },
            function (lodash_1_1) {
                lodash_1 = lodash_1_1;
            },
            function (index_1_1) {
                index_1 = index_1_1;
            },
            function (BoomSeriesUtils_1_1) {
                BoomSeriesUtils_1 = BoomSeriesUtils_1_1;
            },
            function (GrafanaUtils_1_1) {
                GrafanaUtils_1 = GrafanaUtils_1_1;
            }
        ],
        execute: function () {
            BoomSeries = (function () {
                function BoomSeries(seriesData, panelDefaultPattern, panelPatterns, options, scopedVars, templateSrv, timeSrv) {
                    this.pattern = undefined;
                    this.template_value = "";
                    this.row_col_wrapper = "_";
                    this.display_value = "-";
                    this.tooltip = "-";
                    this.value = NaN;
                    this.value_formatted = "-";
                    this.link = "-";
                    this.hidden = false;
                    this._metricname = "";
                    this._tags = [];
                    var series = new time_series2_1.default({
                        alias: seriesData.target,
                        datapoints: seriesData.datapoints || []
                    });
                    series.flotpairs = series.getFlotPairs("connected");
                    this.debug_mode = options && options.debug_mode === true ? true : false;
                    this.row_col_wrapper = options && options.row_col_wrapper ? options.row_col_wrapper : this.row_col_wrapper;
                    this.currentTimeStamp = BoomSeriesUtils_1.getCurrentTimeStamp(series.dataPoints);
                    this.seriesName = series.alias || series.aliasEscaped || series.label || series.id || "";
                    var getMatchingAndEnabledPattern = function (patterns, seriesName) { return patterns.find(function (p) { return seriesName.match(p.pattern) && p.disabled !== true; }); };
                    this.pattern = getMatchingAndEnabledPattern(panelPatterns, this.seriesName) || panelDefaultPattern;
                    this.decimals = this.pattern.decimals || panelDefaultPattern.decimals || 2;
                    this.value = BoomSeriesUtils_1.getSeriesValue(series, this.pattern.valueName);
                    this.display_value = (lodash_1.default.isNaN(this.value) || this.value === null) ? this.pattern.null_value : String(this.value);
                    this.value_formatted = GrafanaUtils_1.get_formatted_value(this.value, this.decimals, this.pattern.format);
                    this.display_value = String(this.value_formatted);
                    this.hidden = BoomSeriesUtils_1.doesValueNeedsToHide(this.value, this.pattern.filter);
                    this._metricname = this.pattern.delimiter.toLowerCase() === "tag" ? index_1.getMetricNameFromTaggedAlias(seriesData.target) : "";
                    this._tags = this.pattern.delimiter.toLowerCase() === "tag" ? index_1.getLablesFromTaggedAlias(seriesData.target, this._metricname) : [];
                    this.row_name = BoomSeriesUtils_1.getRowName(this.pattern.row_name, this.pattern.delimiter, this.row_col_wrapper, this.seriesName, this._metricname, this._tags);
                    this.row_name_raw = BoomSeriesUtils_1.getRowName(this.pattern.row_name, this.pattern.delimiter, this.row_col_wrapper, this.seriesName, this._metricname, this._tags);
                    this.col_name = BoomSeriesUtils_1.getColName(this.pattern.col_name, this.pattern.delimiter, this.row_col_wrapper, this.seriesName, this.row_name, this._metricname, this._tags);
                    this.thresholds = BoomSeriesUtils_1.getThresholds(templateSrv.replace(this.pattern.thresholds, scopedVars).split(",").map(function (d) { return +d; }), this.pattern.enable_time_based_thresholds, this.pattern.time_based_thresholds, this.currentTimeStamp);
                    this.color_bg = BoomSeriesUtils_1.getBGColor(this.value, this.pattern, this.thresholds, templateSrv.replace(this.pattern.bgColors, scopedVars).split("|"), templateSrv.replace(this.pattern.bgColors_overrides, scopedVars).split("|"));
                    this.color_text = BoomSeriesUtils_1.getTextColor(this.value, this.pattern, this.thresholds, templateSrv.replace(this.pattern.textColors, scopedVars).split("|"), templateSrv.replace(this.pattern.textColors_overrides, scopedVars).split("|"));
                    this.template_value = BoomSeriesUtils_1.getDisplayValueTemplate(this.value, this.pattern, this.seriesName, this.row_col_wrapper, this.thresholds);
                    this.link = BoomSeriesUtils_1.getLink(this.pattern.enable_clickable_cells, this.pattern.clickable_cells_link, timeSrv.timeRangeForUrl());
                    this.link = BoomSeriesUtils_1.replaceDelimitedColumns(this.link, this.seriesName, this.pattern.delimiter, this.row_col_wrapper);
                    this.tooltip = this.pattern.tooltipTemplate || "Series : _series_ <br/>Row Name : _row_name_ <br/>Col Name : _col_name_ <br/>Value : _value_";
                    this.replaceSeriesRowColTokens();
                    this.link = BoomSeriesUtils_1.GetValuesReplaced(this.link, this.value, this.value_formatted, series.stats, this.decimals, this.pattern.format, this._metricname, this._tags, this.pattern.delimiter || "");
                    this.tooltip = BoomSeriesUtils_1.GetValuesReplaced(this.tooltip, this.value, this.value_formatted, series.stats, this.decimals, this.pattern.format, this._metricname, this._tags, this.pattern.delimiter || "");
                    this.display_value = BoomSeriesUtils_1.GetValuesReplaced(this.display_value, this.value, this.value_formatted, series.stats, this.decimals, this.pattern.format, this._metricname, this._tags, this.pattern.delimiter || "");
                    this.row_name = index_1.replaceTokens(this.row_name);
                    this.col_name = index_1.replaceTokens(this.col_name);
                    this.display_value = index_1.replaceTokens(this.display_value);
                    this.row_name = templateSrv.replace(this.row_name, scopedVars);
                    this.col_name = templateSrv.replace(this.col_name, scopedVars);
                    this.display_value = templateSrv.replace(this.display_value, scopedVars);
                    this.tooltip = templateSrv.replace(this.tooltip, scopedVars);
                    this.link = templateSrv.replace(this.link, scopedVars);
                    if (this.debug_mode !== true) {
                        delete this.seriesName;
                        delete this.pattern;
                        delete this.thresholds;
                        delete this.decimals;
                        delete this.template_value;
                        delete this.value_formatted;
                        delete this.currentTimeStamp;
                    }
                }
                BoomSeries.prototype.replaceSeriesRowColTokens = function () {
                    this.link = this.link.replace(new RegExp("_series_", "g"), this.seriesName.toString().trim());
                    this.tooltip = this.tooltip.replace(new RegExp("_series_", "g"), this.seriesName.toString().trim());
                    this.display_value = this.template_value.replace(new RegExp("_series_", "g"), this.seriesName.toString());
                    this.col_name = this.col_name.replace(new RegExp("_row_name_", "g"), this.row_name.toString());
                    this.link = this.link.replace(new RegExp("_row_name_", "g"), index_1.getActualNameWithoutTokens(this.row_name.toString()).trim());
                    this.tooltip = this.tooltip.replace(new RegExp("_row_name_", "g"), index_1.getActualNameWithoutTokens(this.row_name.toString()).trim());
                    this.display_value = this.display_value.replace(new RegExp("_row_name_", "g"), this.row_name.toString());
                    this.row_name = this.row_name.replace(new RegExp("_col_name_", "g"), this.col_name.toString());
                    this.link = this.link.replace(new RegExp("_col_name_", "g"), index_1.getActualNameWithoutTokens(this.col_name.toString()).trim());
                    this.tooltip = this.tooltip.replace(new RegExp("_col_name_", "g"), index_1.getActualNameWithoutTokens(this.col_name.toString()).trim());
                    this.display_value = this.display_value.replace(new RegExp("_col_name_", "g"), this.col_name.toString());
                };
                return BoomSeries;
            }());
            exports_1("BoomSeries", BoomSeries);
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQm9vbVNlcmllcyBjb3B5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9ib29tL0Jvb21TZXJpZXMgY29weS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQVNBO2dCQXdCSSxvQkFBWSxVQUFlLEVBQUUsbUJBQXdCLEVBQUUsYUFBb0IsRUFBRSxPQUFZLEVBQUUsVUFBZSxFQUFFLFdBQWdCLEVBQUUsT0FBWTtvQkFyQmxJLFlBQU8sR0FBUSxTQUFTLENBQUM7b0JBR3pCLG1CQUFjLEdBQUcsRUFBRSxDQUFDO29CQUNwQixvQkFBZSxHQUFHLEdBQUcsQ0FBQztvQkFPdkIsa0JBQWEsR0FBRyxHQUFHLENBQUM7b0JBQ3BCLFlBQU8sR0FBRyxHQUFHLENBQUM7b0JBQ2QsVUFBSyxHQUFHLEdBQUcsQ0FBQztvQkFDWixvQkFBZSxHQUFHLEdBQUcsQ0FBQztvQkFDdEIsU0FBSSxHQUFHLEdBQUcsQ0FBQztvQkFFWCxXQUFNLEdBQVksS0FBSyxDQUFDO29CQUN4QixnQkFBVyxHQUFHLEVBQUUsQ0FBQztvQkFDakIsVUFBSyxHQUFVLEVBQUUsQ0FBQztvQkFJckIsSUFBSSxNQUFNLEdBQUcsSUFBSSxzQkFBVSxDQUFDO3dCQUN4QixLQUFLLEVBQUUsVUFBVSxDQUFDLE1BQU07d0JBQ3hCLFVBQVUsRUFBRSxVQUFVLENBQUMsVUFBVSxJQUFJLEVBQUU7cUJBQzFDLENBQUMsQ0FBQztvQkFDSCxNQUFNLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUM7b0JBRXBELElBQUksQ0FBQyxVQUFVLEdBQUcsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztvQkFDeEUsSUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxD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SSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxNQUFNLENBQUMsWUFBWSxFQUFFLEdBQUcsQ0FBQyxFQUFFLGtDQUEwQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO29CQUMxSCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsRUFBRSxrQ0FBMEIsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDaEksSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUU3RyxDQUFDO2dCQUVMLGlCQUFDO1lBQUQsQ0FBQyxBQTdHRCxJQTZHQyIsInNvdXJjZXNDb250ZW50IjpbIi8vLzxyZWZlcmVuY2UgcGF0aD1cIi4uLy4uLy4uL25vZGVfbW9kdWxlcy9ncmFmYW5hLXNkay1tb2Nrcy9hcHAvaGVhZGVycy9jb21tb24uZC50c1wiIC8+XG5cbmltcG9ydCBUaW1lU2VyaWVzIGZyb20gXCJhcHAvY29yZS90aW1lX3NlcmllczJcIjtcbmltcG9ydCBfIGZyb20gXCJsb2Rhc2hcIjtcbmltcG9ydCB7IHJlcGxhY2VUb2tlbnMsIGdldEFjdHVhbE5hbWVXaXRob3V0VG9rZW5zLCBnZXRNZXRyaWNOYW1lRnJvbVRhZ2dlZEFsaWFzLCBnZXRMYWJsZXNGcm9tVGFnZ2VkQWxpYXMgfSBmcm9tIFwiLi9pbmRleFwiO1xuaW1wb3J0IHsgZ2V0RGlzcGxheVZhbHVlVGVtcGxhdGUsIGdldFRocmVzaG9sZHMsIGdldEJHQ29sb3IsIGdldFRleHRDb2xvciwgZ2V0U2VyaWVzVmFsdWUsIGdldExpbmssIGdldEN1cnJlbnRUaW1lU3RhbXAsIGRvZXNWYWx1ZU5lZWRzVG9IaWRlLCByZXBsYWNlRGVsaW1pdGVkQ29sdW1ucywgZ2V0Um93TmFtZSwgZ2V0Q29sTmFtZSwgR2V0VmFsdWVzUmVwbGFjZWQgfSBmcm9tIFwiLi9Cb29tU2VyaWVzVXRpbHNcIjtcbmltcG9ydCB7IGdldF9mb3JtYXR0ZWRfdmFsdWUgfSBmcm9tIFwiLi8uLi9HcmFmYW5hVXRpbHNcIjtcbmltcG9ydCB7IElCb29tU2VyaWVzIH0gZnJvbSBcIi4vQm9vbS5pbnRlcmZhY2VcIjtcblxuY2xhc3MgQm9vbVNlcmllcyBpbXBsZW1lbnRzIElCb29tU2VyaWVzIHtcblxuICAgIHByaXZhdGUgZGVidWdfbW9kZTogQm9vbGVhbjtcbiAgICBwcml2YXRlIHBhdHRlcm46IGFueSA9IHVuZGVmaW5lZDtcbiAgICBwcml2YXRlIHNlcmllc05hbWU6IHN0cmluZztcbiAgICBwcml2YXRlIGN1cnJlbnRUaW1lU3RhbXA6IERhdGU7XG4gICAgcHJpdmF0ZSB0ZW1wbGF0ZV92YWx1ZSA9IFwiXCI7XG4gICAgcHJpdmF0ZSByb3dfY29sX3dyYXBwZXIgPSBcIl9cIjtcbiAgICBwcml2YXRlIGRlY2ltYWxzOiBOdW1iZXI7XG4gICAgcHVibGljIGNvbF9uYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHJvd19uYW1lOiBzdHJpbmc7XG4gICAgcHVibGljIHJvd19uYW1lX3Jhdzogc3RyaW5nO1xuICAgIHB1YmxpYyBjb2xvcl9iZzogc3RyaW5nO1xuICAgIHB1YmxpYyBjb2xvcl90ZXh0OiBzdHJpbmc7XG4gICAgcHVibGljIGRpc3BsYXlfdmFsdWUgPSBcIi1cIjtcbiAgICBwdWJsaWMgdG9vbHRpcCA9IFwiLVwiO1xuICAgIHB1YmxpYyB2YWx1ZSA9IE5hTjtcbiAgICBwdWJsaWMgdmFsdWVfZm9ybWF0dGVkID0gXCItXCI7XG4gICAgcHVibGljIGxpbmsgPSBcIi1cIjtcbiAgICBwdWJsaWMgdGhyZXNob2xkczogTnVtYmVyW107XG4gICAgcHVibGljIGhpZGRlbjogQm9vbGVhbiA9IGZhbHNlO1xuICAgIHB1YmxpYyBfbWV0cmljbmFtZSA9IFwiXCI7XG4gICAgcHVibGljIF90YWdzOiBhbnlbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3Ioc2VyaWVzRGF0YTogYW55LCBwYW5lbERlZmF1bHRQYXR0ZXJuOiBhbnksIHBhbmVsUGF0dGVybnM6IGFueVtdLCBvcHRpb25zOiBhbnksIHNjb3BlZFZhcnM6IGFueSwgdGVtcGxhdGVTcnY6IGFueSwgdGltZVNydjogYW55KSB7XG5cbiAgICAgICAgbGV0IHNlcmllcyA9IG5ldyBUaW1lU2VyaWVzKHtcbiAgICAgICAgICAgIGFsaWFzOiBzZXJpZXNEYXRhLnRhcmdldCxcbiAgICAgICAgICAgIGRhdGFwb2ludHM6IHNlcmllc0RhdGEuZGF0YXBvaW50cyB8fCBbXVxuICAgICAgICB9KTtcbiAgICAgICAgc2VyaWVzLmZsb3RwYWlycyA9IHNlcmllcy5nZXRGbG90UGFpcnMoXCJjb25uZWN0ZWRcIik7XG5cbiAgICAgICAgdGhpcy5kZWJ1Z19tb2RlID0gb3B0aW9ucyAmJiBvcHRpb25zLmRlYnVnX21vZGUgPT09IHRydWUgPyB0cnVlIDogZmFsc2U7XG4gICAgICAgIHRoaXMucm93X2NvbF93cmFwcGVyID0gb3B0aW9ucyAmJiBvcHRpb25zLnJvd19jb2xfd3JhcHBlciA/IG9wdGlvbnMucm93X2NvbF93cmFwcGVyIDogdGhpcy5yb3dfY29sX3dyYXBwZXI7XG4gICAgICAgIHRoaXMuY3VycmVudFRpbWVTdGFtcCA9IGdldEN1cnJlbnRUaW1lU3RhbXAoc2VyaWVzLmRhdGFQb2ludHMpO1xuICAgICAgICB0aGlzLnNlcmllc05hbWUgPSBzZXJpZXMuYWxpYXMgfHwgc2VyaWVzLmFsaWFzRXNjYXBlZCB8fCBzZXJpZXMubGFiZWwgfHwgc2VyaWVzLmlkIHx8IFwiXCI7XG5cbiAgICAgICAgbGV0IGdldE1hdGNoaW5nQW5kRW5hYmxlZFBhdHRlcm4gPSAocGF0dGVybnMsIHNlcmllc05hbWUpID0+IHBhdHRlcm5zLmZpbmQocCA9PiBzZXJpZXNOYW1lLm1hdGNoKHAucGF0dGVybikgJiYgcC5kaXNhYmxlZCAhPT0gdHJ1ZSk7XG4gICAgICAgIHRoaXMucGF0dGVybiA9IGdldE1hdGNoaW5nQW5kRW5hYmxlZFBhdHRlcm4ocGFuZWxQYXR0ZXJucywgdGhpcy5zZXJpZXNOYW1lKSB8fCBwYW5lbERlZmF1bHRQYXR0ZXJuO1xuXG4gICAgICAgIHRoaXMuZGVjaW1hbHMgPSB0aGlzLnBhdHRlcm4uZGVjaW1hbHMgfHwgcGFuZWxEZWZhdWx0UGF0dGVybi5kZWNpbWFscyB8fCAyO1xuICAgICAgICB0aGlzLnZhbHVlID0gZ2V0U2VyaWVzVmFsdWUoc2VyaWVzLCB0aGlzLnBhdHRlcm4udmFsdWVOYW1lKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5X3ZhbHVlID0gKF8uaXNOYU4odGhpcy52YWx1ZSkgfHwgdGhpcy52YWx1ZSA9PT0gbnVsbCkgPyB0aGlzLnBhdHRlcm4ubnVsbF92YWx1ZSA6IFN0cmluZyh0aGlzLnZhbHVlKTtcbiAgICAgICAgdGhpcy52YWx1ZV9mb3JtYXR0ZWQgPSBnZXRfZm9ybWF0dGVkX3ZhbHVlKHRoaXMudmFsdWUsIHRoaXMuZGVjaW1hbHMsIHRoaXMucGF0dGVybi5mb3JtYXQpO1xuICAgICAgICB0aGlzLmRpc3BsYXlfdmFsdWUgPSBTdHJpbmcodGhpcy52YWx1ZV9mb3JtYXR0ZWQpO1xuICAgICAgICB0aGlzLmhpZGRlbiA9IGRvZXNWYWx1ZU5lZWRzVG9IaWRlKHRoaXMudmFsdWUsIHRoaXMucGF0dGVybi5maWx0ZXIpO1xuICAgICAgICB0aGlzLl9tZXRyaWNuYW1lID0gdGhpcy5wYXR0ZXJuLmRlbGltaXRlci50b0xvd2VyQ2FzZSgpID09PSBcInRhZ1wiID8gZ2V0TWV0cmljTmFtZUZyb21UYWdnZWRBbGlhcyhzZXJpZXNEYXRhLnRhcmdldCkgOiBcIlwiO1xuICAgICAgICB0aGlzLl90YWdzID0gdGhpcy5wYXR0ZXJuLmRlbGltaXRlci50b0xvd2VyQ2FzZSgpID09PSBcInRhZ1wiID8gZ2V0TGFibGVzRnJvbVRhZ2dlZEFsaWFzKHNlcmllc0RhdGEudGFyZ2V0LCB0aGlzLl9tZXRyaWNuYW1lKSA6IFtdO1xuXG4gICAgICAgIHRoaXMucm93X25hbWUgPSBnZXRSb3dOYW1lKHRoaXMucGF0dGVybi5yb3dfbmFtZSwgdGhpcy5wYXR0ZXJuLmRlbGltaXRlciwgdGhpcy5yb3dfY29sX3dyYXBwZXIsIHRoaXMuc2VyaWVzTmFtZSwgdGhpcy5fbWV0cmljbmFtZSwgdGhpcy5fdGFncyk7XG4gICAgICAgIHRoaXMucm93X25hbWVfcmF3ID0gZ2V0Um93TmFtZSh0aGlzLnBhdHRlcm4ucm93X25hbWUsIHRoaXMucGF0dGVybi5kZWxpbWl0ZXIsIHRoaXMucm93X2NvbF93cmFwcGVyLCB0aGlzLnNlcmllc05hbWUsIHRoaXMuX21ldHJpY25hbWUsIHRoaXMuX3RhZ3MpO1xuICAgICAgICB0aGlzLmNvbF9uYW1lID0gZ2V0Q29sTmFtZSh0aGlzLnBhdHRlcm4uY29sX25hbWUsIHRoaXMucGF0dGVybi5kZWxpbWl0ZXIsIHRoaXMucm93X2NvbF93cmFwcGVyLCB0aGlzLnNlcmllc05hbWUsIHRoaXMucm93X25hbWUsIHRoaXMuX21ldHJpY25hbWUsIHRoaXMuX3RhZ3MpO1xuXG4gICAgICAgIHRoaXMudGhyZXNob2xkcyA9IGdldFRocmVzaG9sZHModGVtcGxhdGVTcnYucmVwbGFjZSh0aGlzLnBhdHRlcm4udGhyZXNob2xkcywgc2NvcGVkVmFycykuc3BsaXQoXCIsXCIpLm1hcChkID0+ICtkKSwgdGhpcy5wYXR0ZXJuLmVuYWJsZV90aW1lX2Jhc2VkX3RocmVzaG9sZHMsIHRoaXMucGF0dGVybi50aW1lX2Jhc2VkX3RocmVzaG9sZHMsIHRoaXMuY3VycmVudFRpbWVTdGFtcCk7XG4gICAgICAgIHRoaXMuY29sb3JfYmcgPSBnZXRCR0NvbG9yKHRoaXMudmFsdWUsIHRoaXMucGF0dGVybiwgdGhpcy50aHJlc2hvbGRzLCB0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMucGF0dGVybi5iZ0NvbG9ycywgc2NvcGVkVmFycykuc3BsaXQoXCJ8XCIpLCB0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMucGF0dGVybi5iZ0NvbG9yc19vdmVycmlkZXMsIHNjb3BlZFZhcnMpLnNwbGl0KFwifFwiKSk7XG4gICAgICAgIHRoaXMuY29sb3JfdGV4dCA9IGdldFRleHRDb2xvcih0aGlzLnZhbHVlLCB0aGlzLnBhdHRlcm4sIHRoaXMudGhyZXNob2xkcywgdGVtcGxhdGVTcnYucmVwbGFjZSh0aGlzLnBhdHRlcm4udGV4dENvbG9ycywgc2NvcGVkVmFycykuc3BsaXQoXCJ8XCIpLCB0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMucGF0dGVybi50ZXh0Q29sb3JzX292ZXJyaWRlcywgc2NvcGVkVmFycykuc3BsaXQoXCJ8XCIpKTtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZV92YWx1ZSA9IGdldERpc3BsYXlWYWx1ZVRlbXBsYXRlKHRoaXMudmFsdWUsIHRoaXMucGF0dGVybiwgdGhpcy5zZXJpZXNOYW1lLCB0aGlzLnJvd19jb2xfd3JhcHBlciwgdGhpcy50aHJlc2hvbGRzKTtcblxuICAgICAgICB0aGlzLmxpbmsgPSBnZXRMaW5rKHRoaXMucGF0dGVybi5lbmFibGVfY2xpY2thYmxlX2NlbGxzLCB0aGlzLnBhdHRlcm4uY2xpY2thYmxlX2NlbGxzX2xpbmssIHRpbWVTcnYudGltZVJhbmdlRm9yVXJsKCkpO1xuICAgICAgICB0aGlzLmxpbmsgPSByZXBsYWNlRGVsaW1pdGVkQ29sdW1ucyh0aGlzLmxpbmssIHRoaXMuc2VyaWVzTmFtZSwgdGhpcy5wYXR0ZXJuLmRlbGltaXRlciwgdGhpcy5yb3dfY29sX3dyYXBwZXIpO1xuXG4gICAgICAgIHRoaXMudG9vbHRpcCA9IHRoaXMucGF0dGVybi50b29sdGlwVGVtcGxhdGUgfHwgXCJTZXJpZXMgOiBfc2VyaWVzXyA8YnIvPlJvdyBOYW1lIDogX3Jvd19uYW1lXyA8YnIvPkNvbCBOYW1lIDogX2NvbF9uYW1lXyA8YnIvPlZhbHVlIDogX3ZhbHVlX1wiO1xuXG4gICAgICAgIHRoaXMucmVwbGFjZVNlcmllc1Jvd0NvbFRva2VucygpO1xuXG4gICAgICAgIHRoaXMubGluayA9IEdldFZhbHVlc1JlcGxhY2VkKHRoaXMubGluaywgdGhpcy52YWx1ZSwgdGhpcy52YWx1ZV9mb3JtYXR0ZWQsIHNlcmllcy5zdGF0cywgdGhpcy5kZWNpbWFscywgdGhpcy5wYXR0ZXJuLmZvcm1hdCwgdGhpcy5fbWV0cmljbmFtZSwgdGhpcy5fdGFncywgdGhpcy5wYXR0ZXJuLmRlbGltaXRlciB8fCBcIlwiKTtcbiAgICAgICAgdGhpcy50b29sdGlwID0gR2V0VmFsdWVzUmVwbGFjZWQodGhpcy50b29sdGlwLCB0aGlzLnZhbHVlLCB0aGlzLnZhbHVlX2Zvcm1hdHRlZCwgc2VyaWVzLnN0YXRzLCB0aGlzLmRlY2ltYWxzLCB0aGlzLnBhdHRlcm4uZm9ybWF0LCB0aGlzLl9tZXRyaWNuYW1lLCB0aGlzLl90YWdzLCB0aGlzLnBhdHRlcm4uZGVsaW1pdGVyIHx8IFwiXCIpO1xuICAgICAgICB0aGlzLmRpc3BsYXlfdmFsdWUgPSBHZXRWYWx1ZXNSZXBsYWNlZCh0aGlzLmRpc3BsYXlfdmFsdWUsIHRoaXMudmFsdWUsIHRoaXMudmFsdWVfZm9ybWF0dGVkLCBzZXJpZXMuc3RhdHMsIHRoaXMuZGVjaW1hbHMsIHRoaXMucGF0dGVybi5mb3JtYXQsIHRoaXMuX21ldHJpY25hbWUsIHRoaXMuX3RhZ3MsIHRoaXMucGF0dGVybi5kZWxpbWl0ZXIgfHwgXCJcIik7XG5cbiAgICAgICAgdGhpcy5yb3dfbmFtZSA9IHJlcGxhY2VUb2tlbnModGhpcy5yb3dfbmFtZSk7XG4gICAgICAgIHRoaXMuY29sX25hbWUgPSByZXBsYWNlVG9rZW5zKHRoaXMuY29sX25hbWUpO1xuICAgICAgICB0aGlzLmRpc3BsYXlfdmFsdWUgPSByZXBsYWNlVG9rZW5zKHRoaXMuZGlzcGxheV92YWx1ZSk7XG5cbiAgICAgICAgdGhpcy5yb3dfbmFtZSA9IHRlbXBsYXRlU3J2LnJlcGxhY2UodGhpcy5yb3dfbmFtZSwgc2NvcGVkVmFycyk7XG4gICAgICAgIHRoaXMuY29sX25hbWUgPSB0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMuY29sX25hbWUsIHNjb3BlZFZhcnMpO1xuICAgICAgICB0aGlzLmRpc3BsYXlfdmFsdWUgPSB0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMuZGlzcGxheV92YWx1ZSwgc2NvcGVkVmFycyk7XG5cbiAgICAgICAgdGhpcy50b29sdGlwID0gdGVtcGxhdGVTcnYucmVwbGFjZSh0aGlzLnRvb2x0aXAsIHNjb3BlZFZhcnMpO1xuICAgICAgICB0aGlzLmxpbmsgPSB0ZW1wbGF0ZVNydi5yZXBsYWNlKHRoaXMubGluaywgc2NvcGVkVmFycyk7XG5cbiAgICAgICAgaWYgKHRoaXMuZGVidWdfbW9kZSAhPT0gdHJ1ZSkge1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuc2VyaWVzTmFtZTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnBhdHRlcm47XG4gICAgICAgICAgICBkZWxldGUgdGhpcy50aHJlc2hvbGRzO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuZGVjaW1hbHM7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy50ZW1wbGF0ZV92YWx1ZTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlX2Zvcm1hdHRlZDtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmN1cnJlbnRUaW1lU3RhbXA7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBwcml2YXRlIHJlcGxhY2VTZXJpZXNSb3dDb2xUb2tlbnMoKSB7XG5cbiAgICAgICAgdGhpcy5saW5rID0gdGhpcy5saW5rLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9zZXJpZXNfXCIsIFwiZ1wiKSwgdGhpcy5zZXJpZXNOYW1lLnRvU3RyaW5nKCkudHJpbSgpKTtcbiAgICAgICAgdGhpcy50b29sdGlwID0gdGhpcy50b29sdGlwLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9zZXJpZXNfXCIsIFwiZ1wiKSwgdGhpcy5zZXJpZXNOYW1lLnRvU3RyaW5nKCkudHJpbSgpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5X3ZhbHVlID0gdGhpcy50ZW1wbGF0ZV92YWx1ZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfc2VyaWVzX1wiLCBcImdcIiksIHRoaXMuc2VyaWVzTmFtZS50b1N0cmluZygpKTtcblxuICAgICAgICB0aGlzLmNvbF9uYW1lID0gdGhpcy5jb2xfbmFtZS5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfcm93X25hbWVfXCIsIFwiZ1wiKSwgdGhpcy5yb3dfbmFtZS50b1N0cmluZygpKTtcbiAgICAgICAgdGhpcy5saW5rID0gdGhpcy5saW5rLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9yb3dfbmFtZV9cIiwgXCJnXCIpLCBnZXRBY3R1YWxOYW1lV2l0aG91dFRva2Vucyh0aGlzLnJvd19uYW1lLnRvU3RyaW5nKCkpLnRyaW0oKSk7XG4gICAgICAgIHRoaXMudG9vbHRpcCA9IHRoaXMudG9vbHRpcC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfcm93X25hbWVfXCIsIFwiZ1wiKSwgZ2V0QWN0dWFsTmFtZVdpdGhvdXRUb2tlbnModGhpcy5yb3dfbmFtZS50b1N0cmluZygpKS50cmltKCkpO1xuICAgICAgICB0aGlzLmRpc3BsYXlfdmFsdWUgPSB0aGlzLmRpc3BsYXlfdmFsdWUucmVwbGFjZShuZXcgUmVnRXhwKFwiX3Jvd19uYW1lX1wiLCBcImdcIiksIHRoaXMucm93X25hbWUudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgdGhpcy5yb3dfbmFtZSA9IHRoaXMucm93X25hbWUucmVwbGFjZShuZXcgUmVnRXhwKFwiX2NvbF9uYW1lX1wiLCBcImdcIiksIHRoaXMuY29sX25hbWUudG9TdHJpbmcoKSk7XG4gICAgICAgIHRoaXMubGluayA9IHRoaXMubGluay5yZXBsYWNlKG5ldyBSZWdFeHAoXCJfY29sX25hbWVfXCIsIFwiZ1wiKSwgZ2V0QWN0dWFsTmFtZVdpdGhvdXRUb2tlbnModGhpcy5jb2xfbmFtZS50b1N0cmluZygpKS50cmltKCkpO1xuICAgICAgICB0aGlzLnRvb2x0aXAgPSB0aGlzLnRvb2x0aXAucmVwbGFjZShuZXcgUmVnRXhwKFwiX2NvbF9uYW1lX1wiLCBcImdcIiksIGdldEFjdHVhbE5hbWVXaXRob3V0VG9rZW5zKHRoaXMuY29sX25hbWUudG9TdHJpbmcoKSkudHJpbSgpKTtcbiAgICAgICAgdGhpcy5kaXNwbGF5X3ZhbHVlID0gdGhpcy5kaXNwbGF5X3ZhbHVlLnJlcGxhY2UobmV3IFJlZ0V4cChcIl9jb2xfbmFtZV9cIiwgXCJnXCIpLCB0aGlzLmNvbF9uYW1lLnRvU3RyaW5nKCkpO1xuXG4gICAgfVxuXG59XG5cbmV4cG9ydCB7XG4gICAgQm9vbVNlcmllc1xufTtcbiJdfQ==