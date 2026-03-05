import React, { memo } from "react";
import "./CustomDownloadLoader.css";

export const CustomDownloadLoader = memo(
  ({ open, downloadedMB = 0, totalMB = 0, downloadProgress = 0 }) => {
    if (!open) return null;

    const isDownloading = downloadedMB > 0;

    return (
      <div className="loader-backdrop">
        <div className="loader-container">
          {/* Spinner */}
          <div className="loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          {/* Download Progress */}
          {isDownloading && (
            <div className="loader-progress-wrapper">
              <p className="loader-progress-title">Downloading File...</p>

              {/* Progress Bar */}
              {totalMB > 0 && (
                <div className="loader-progress-bar-track">
                  <div
                    className="loader-progress-bar-fill"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              )}

              {/* MB Info */}
              <p className="loader-progress-text">
                {totalMB > 0
                  ? `${downloadedMB} MB / ${totalMB} MB (${downloadProgress}%)`
                  : `${downloadedMB} MB downloaded`}
              </p>
            </div>
          )}

          {/* Default loading text when not downloading */}
          {!isDownloading && (
            <p className="loader-default-text">Please wait...</p>
          )}
        </div>
      </div>
    );
  },
);
