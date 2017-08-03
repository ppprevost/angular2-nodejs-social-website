/**
 * Created by sfrBox on 03/08/2017.
 */
abstract class ModelCtrl {

  abstract model: any;

  /**
   *
   * @param id
   * @param {Function} res
   */
  findOne(id, res) {
    this.model.findOne({_id: id}, (err, obj) => {
      if (err) {
        console.error(err);
        res(err);
      }
      res(null, obj);
    });
  }
  
}
