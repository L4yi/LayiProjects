import iphoneImg from "../assets/all-images/product-images/iphone-13.png";
import jordanImg from "../assets/all-images/product-images/nike-air-jordan.png";
import tshirtImg from "../assets/all-images/product-images/tshirt.png";
import bagImg from "../assets/all-images/product-images/cross-bag.png";
import headphonesImg from "../assets/all-images/product-images/headphones.png";
import smartwatchImg from "../assets/all-images/product-images/smartwatch.png";

export default function Products() {
    return (
        <>
            <div className="dashboard-body">
                <div className="module-top-badge-wrap">
                    <div className="module-badge-pill">
                        <i className="bi bi-box-seam"></i>
                        <span>Products</span>
                    </div>
                    <div className="module-breadcrumb">
                        Inventory &rarr; Manage store catalogue, pricing, and stock levels.
                    </div>
                </div>

                <div className="module-header-bar">
                    <div className="header-left">
                        <h2 className="module-main-title">All Products</h2>
                        <span className="module-count-subtitle">15 items in stock</span>
                    </div>
                    <div className="header-right">
                        <div className="filter-select-wrap">
                            <i className="bi bi-funnel"></i>
                            <select
                                className="filter-dropdown-select"
                                title="Filter by Category"
                                defaultValue=""
                            >
                                <option value="">All Categories</option>
                                <option value="mobile">Mobile Devices</option>
                                <option value="footwear">Footwear</option>
                                <option value="apparel">Apparel</option>
                                <option value="accessories">Accessories</option>
                                <option value="wearable">Wearable Tech</option>
                                <option value="audio">Audio Devices</option>
                            </select>
                        </div>
                        <button
                            type="button"
                            className="btn-add-entity"
                            title="Add Product"
                        >
                            <i className="bi bi-plus-lg"></i> Add Product
                        </button>
                    </div>
                </div>

                <div className="module-table-card">
                    <div className="table-responsive">
                        <table className="solara-data-table">
                            <thead>
                                <tr>
                                    <th>SN <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Name <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>ID <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Category <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Status <span className="sort-icon">&uarr;&darr;</span></th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="col-sn">1</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={iphoneImg} alt="Apple iPhone 13 Pro" className="product-real-thumb" />
                                            <span className="product-title">Apple iPhone 13 Pro</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-001</td>
                                    <td className="col-prod-category"><span className="category-pill">Mobile Devices</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">2</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={jordanImg} alt="Nike Air Jordan High" className="product-real-thumb" />
                                            <span className="product-title">Nike Air Jordan High</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-002</td>
                                    <td className="col-prod-category"><span className="category-pill">Footwear</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">3</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={tshirtImg} alt="Classic Cotton T-Shirt" className="product-real-thumb" />
                                            <span className="product-title">Classic Cotton T-Shirt</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-003</td>
                                    <td className="col-prod-category"><span className="category-pill">Apparel</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">4</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={bagImg} alt="Assorted Leather Cross Bag" className="product-real-thumb" />
                                            <span className="product-title">Assorted Leather Cross Bag</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-004</td>
                                    <td className="col-prod-category"><span className="category-pill">Accessories</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">5</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={smartwatchImg} alt="Smart Fitness Tracker Band" className="product-real-thumb" />
                                            <span className="product-title">Smart Fitness Tracker Band</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-005</td>
                                    <td className="col-prod-category"><span className="category-pill">Wearable Tech</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">6</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={headphonesImg} alt="Noise Canceling Headphones" className="product-real-thumb" />
                                            <span className="product-title">Noise Canceling Headphones</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-006</td>
                                    <td className="col-prod-category"><span className="category-pill">Audio Devices</span></td>
                                    <td><span className="status-badge-pill inactive">INACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">7</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={iphoneImg} alt="Apple iPhone 13 Mini" className="product-real-thumb" />
                                            <span className="product-title">Apple iPhone 13 Mini</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-007</td>
                                    <td className="col-prod-category"><span className="category-pill">Mobile Devices</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">8</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={jordanImg} alt="Nike Air Jordan Retro" className="product-real-thumb" />
                                            <span className="product-title">Nike Air Jordan Retro</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-008</td>
                                    <td className="col-prod-category"><span className="category-pill">Footwear</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">9</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={tshirtImg} alt="Vintage Graphic T-Shirt" className="product-real-thumb" />
                                            <span className="product-title">Vintage Graphic T-Shirt</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-009</td>
                                    <td className="col-prod-category"><span className="category-pill">Apparel</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="col-sn">10</td>
                                    <td>
                                        <div className="product-name-cell">
                                            <img src={bagImg} alt="Vintage Leather Crossbody" className="product-real-thumb" />
                                            <span className="product-title">Vintage Leather Crossbody</span>
                                        </div>
                                    </td>
                                    <td className="col-prod-id">#PRD-010</td>
                                    <td className="col-prod-category"><span className="category-pill">Accessories</span></td>
                                    <td><span className="status-badge-pill active">ACTIVE</span></td>
                                    <td>
                                        <div className="action-btn-group">
                                            <button type="button" className="btn-edit">Edit</button>
                                            <button type="button" className="action-pill-btn">View</button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
