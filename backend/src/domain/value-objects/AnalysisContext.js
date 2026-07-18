export default class AnalysisContext {
  constructor({
    date,
    time
  }) {
    this.date = date;
    this.time = time;

    Object.freeze(this);
  }
}