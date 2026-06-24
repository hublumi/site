import { FLOW_GROUPS } from './flow-data.js';

const STORAGE_KEY = 'hublumi_briefing_state_v2';

export class FlowEngine {
  constructor() {
    this.answers = {};
    this.history = []; 
    this.currentGroupId = null;

    this._loadFromStorage();
  }

  _saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        answers: this.answers,
        history: this.history,
        currentGroupId: this.currentGroupId,
      }));
    } catch (_) {}
  }

  _loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      this.answers = saved.answers || {};
      this.history = saved.history || [];
      this.currentGroupId = saved.currentGroupId || null;
    } catch (_) {}
  }

  clearStorage() {
    localStorage.removeItem(STORAGE_KEY);
  }

  getActivePath() {
    return FLOW_GROUPS
      .filter(g => g.dependsOn(this.answers))
      .map(g => g.id);
  }

  getGroup(id) {
    return FLOW_GROUPS.find(g => g.id === id) || null;
  }

  getCurrentGroup() {
    if (!this.currentGroupId) return null;
    return this.getGroup(this.currentGroupId);
  }

  start(fresh = false) {
    if (fresh) {
      this.answers = {};
      this.history = [];
      this.currentGroupId = null;
      this.clearStorage();
    }

    const activePath = this.getActivePath();
    if (activePath.length === 0) return null;

    if (this.currentGroupId && activePath.includes(this.currentGroupId)) {
      return this.getCurrentGroup();
    }

    this.currentGroupId = activePath[0];
    this.history = [this.currentGroupId];
    this._saveToStorage();
    return this.getCurrentGroup();
  }

  next(groupAnswers = {}) {
    Object.assign(this.answers, groupAnswers);

    const activePath = this.getActivePath();
    const currentIndex = activePath.indexOf(this.currentGroupId);

    if (currentIndex === -1 || currentIndex >= activePath.length - 1) {
      this._saveToStorage();
      return null; 
    }

    const nextId = activePath[currentIndex + 1];
    this.currentGroupId = nextId;
    this.history.push(nextId);
    this._saveToStorage();
    return this.getGroup(nextId);
  }

  prev() {
    if (this.history.length <= 1) return null;

    this.history.pop();
    const prevId = this.history[this.history.length - 1];
    this.currentGroupId = prevId;
    this._saveToStorage();
    return this.getGroup(prevId);
  }

  goTo(groupId) {
    const group = this.getGroup(groupId);
    if (!group) return null;

    this.currentGroupId = groupId;
    const activePath = this.getActivePath();
    const idx = activePath.indexOf(groupId);
    this.history = activePath.slice(0, idx + 1);
    this._saveToStorage();
    return group;
  }

  getProgress() {
    const activePath = this.getActivePath();
    const total = activePath.length;
    const currentIndex = activePath.indexOf(this.currentGroupId);

    const current = currentIndex === -1 ? total : currentIndex;

    return {
      current,
      total,
      percent: total === 0 ? 0 : Math.round((current / total) * 100),
      stepLabel: currentIndex === -1
        ? `Revisão final`
        : `Etapa ${current + 1} de ${total}`,
    };
  }

  isFirstStep() {
    return this.history.length <= 1;
  }

  isResuming() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    try {
      const saved = JSON.parse(raw);
      return saved.currentGroupId && Object.keys(saved.answers || {}).length > 0;
    } catch (_) {
      return false;
    }
  }

  getFinalPayload() {
    return { ...this.answers };
  }
}
