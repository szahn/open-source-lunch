import ReactBootstrapSlider from 'react-bootstrap-slider';

export default (props) => <div className="row">
    <form>
        <div className="form-group col-lg-4">
            <label className="col-sm-2 col-form-label">Miles</label>
            <ReactBootstrapSlider orientation='horizontal' min={25} max={1500} step={25} value={props.maxRegionDistanceMiles} change={props.onMaxRegionDistanceMilesChanged}/>
        </div>
        <div className="form-group col-lg-4">
            <label className="col-sm-2 col-form-label">Cities</label>
            <ReactBootstrapSlider orientation='horizontal' min={2} max={100} step={1} value={props.maxRegions} change={props.onMaxRegionsChanged}/>
        </div>     
        <div className="form-group col-lg-4">
            <label className="col-sm-2 col-form-label">Order</label>
            <div className="col-sm-10">
                <select name="orderBy" value={props.orderBy} onChange={props.onOrderByChanged}>
                    <option value="0">Population</option>
                    <option value="1">Distance</option>
                </select>
            </div>
        </div>     
    </form>
</div>