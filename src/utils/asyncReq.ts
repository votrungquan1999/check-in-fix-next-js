import { CancelTokenSource } from 'axios';
import { isNil } from 'lodash/fp';

interface SyncRequest {
  current_id: number;
  source: CancelTokenSource;
}

export function useContinuousRequest() {
  return new ContinuousRequest();
}

class ContinuousRequest {
  currentID: number;
  reqQueue: SyncRequest[];

  constructor() {
    this.currentID = 0;
    this.reqQueue = [];
  }

  addReq(reqID: number, source: CancelTokenSource) {
    this.reqQueue.push({
      current_id: reqID,
      source: source,
    });
  }

  getNewestID() {
    this.currentID = this.currentID + 1;
    return this.currentID;
  }

  /**
   * Process req response take a req id, check if it is latest, then cancel all older req
   * @param reqID the id of the req just resp
   * @returns  a bool to indicate if the reqID is the latest req
   */
  processReqResponse(reqID: number) {
    const req = this.reqQueue.find((syncReq) => syncReq.current_id === reqID);

    if (isNil(req)) {
      return false;
    }

    while (this.reqQueue[0].current_id !== reqID) {
      const outdatedReq = this.reqQueue.shift();

      if (isNil(outdatedReq)) {
        console.log('get outdated req failed');
        return false;
      }

      outdatedReq.source.cancel();
    }

    return true;
  }
}
