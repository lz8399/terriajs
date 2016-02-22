'use strict';

import defined from 'terriajs-cesium/Source/Core/defined';

import Loader from './../Loader.jsx';
import ObserveModelMixin from './../ObserveModelMixin';
import proxyCatalogItemUrl from '../../Models/proxyCatalogItemUrl';

import React from 'react';

const Legend = React.createClass({
    mixins: [ObserveModelMixin],
    propTypes: {
        nowViewingItem: React.PropTypes.object
    },

    onImageError(legend) {
        legend.imageHasError = true;
    },

    getLegends() {
        if (defined(this.props.nowViewingItem.legendUrls)) {
            return this.props.nowViewingItem.legendUrls.map((legendUrl)=>{
                return {
                    url: proxyCatalogItemUrl(this.catalogMember, legendUrl.url),
                    isImage: legendUrl.isImage(),
                    imageHasError: false,
                    onImageError: this.onImageError,
                    insertDirectly: !!legendUrl.safeSvgContent, // we only insert content we generated ourselves, not arbitrary SVG from init files.
                    safeSvgContent: {__html: legendUrl.safeSvgContent}
                };
            });
        }
        return [];
    },

    renderLegends() {
        let legends;
        if (this.props.nowViewingItem.isLoading) {
            legends = <li><Loader/></li>;
        } else {
            legends = this.getLegends() && this.getLegends().map((legend, i)=>{
                if (legend.isImage) {
                    if (legend.imageHasError) {
                        return null;
                    }
                    if (legend.insertDirectly) {
                        return (<li key={i} onError={this.onImageError.bind(this, legend)} className="legend--svg" dangerouslySetInnerHTML={legend.safeSvgContent}></li>);
                    }
                    return (
                        <li key={i}>
                            <a onError={this.onImageError.bind(this, legend)} href={legend.url} target="_blank">
                              <div className="legend--image">
                                  <img src={legend.url}/>
                              </div>
                            </a>
                        </li>
                    );
                }
                return (
                    <li key={i}>
                        <a className="legend--text"
                            href={legend.url}
                            target="_blank">Open legend in a separate tab
                        </a>
                    </li>
                );
            });

            // if (legends.length === 0) {
            //     if (this.props.nowViewingItem.type === 'abs-itt') {
            //         legends = <li key={0} className="legend--text">Select at least one code in each data area.</li>;
            //     } else {
            //         legends = <li key={0} className="legend--text">No legend available for this data item.</li>;
            //     }
            // }
        }
        return (
            <div className="now-viewing__item__legend">
                {legends}
            </div>
        );

    },

    render() {
        return <ul className='legend'>{this.renderLegends()}</ul>;
    }
});
module.exports = Legend;
