import { Object3D, EquirectangularReflectionMapping } from 'three'
import { preloader } from '../loader'

export default class Torus extends Object3D {
  constructor () {
    super()

    this.scale.setScalar(0.03);
    //this.rotation.y = Math.PI * -0.25
    const man = preloader.get('man')
    this.add(man.scene)
  }
}
