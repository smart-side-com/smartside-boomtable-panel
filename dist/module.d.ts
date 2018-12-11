import { MetricsPanelCtrl } from "app/plugins/sdk";
import { ValueNameOption } from "./interfaces/interfaces";
declare class GrafanaBoomTableCtrl extends MetricsPanelCtrl {
    static templateUrl: string;
    ctrl: any;
    elem: any;
    dataReceived: any;
    valueNameOptions: ValueNameOption[];
    unitFormats: any;
    optionOverrides: any;
    constructor($scope: any, $injector: any, $sce: any);
    onInitEditMode(): void;
    onDataReceived(data: any): void;
    addPattern(): void;
    movePattern(direction: String, index: number): void;
    removePattern(index: number): void;
    clonePattern(index: number): void;
    add_time_based_thresholds(index: number): void;
    remove_time_based_thresholds(patternIndex: number, index: number): void;
    inverseBGColors(index: number): void;
    inverseTextColors(index: number): void;
    inverseTransformValues(index: number): void;
    setUnitFormat(subItem: any, index: number): void;
    limitText(text: String, maxlength: number): String;
    link(scope: any, elem: any, attrs: any, ctrl: any): void;
    getOptionOverride(propertyName: String): any;
    setOptionOverride(propertyName: String, value: String, text: String): void;
    removeOptionOverride(option: String): void;
    adjustPanelHeight(panelHeight: number): void;
}
export { GrafanaBoomTableCtrl as PanelCtrl };
